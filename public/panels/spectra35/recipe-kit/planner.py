"""Compile palette indices into exact measured LUTs and per-pixel native histories.

Many colors can share a RAM bank when their native preparation differs. A bank
is a waveform selector, not a final color. No new waveform is synthesized here.
"""
from pathlib import Path
import hashlib,json,zlib,struct
import numpy as np
def compress_block(raw):
    best=zlib.compress(raw,9)
    for strategy in [zlib.Z_DEFAULT_STRATEGY,zlib.Z_FILTERED,zlib.Z_RLE,zlib.Z_FIXED,zlib.Z_HUFFMAN_ONLY]:
        for level in [1,6,9]:
            c=zlib.compressobj(level,zlib.DEFLATED,15,9,strategy);v=c.compress(raw)+c.flush()
            if len(v)<len(best):best=v
    return best


def fnv(data):
 value=2166136261
 for byte in data:value=((value^byte)*16777619)&0xffffffff
 return f'{value:08X}'


def native_bytes(indices):
 a=np.asarray(indices,dtype=np.uint8)
 if a.shape!=(1200,1600) or a.max()>15:raise ValueError('Expected 1600 x 1200 four-bit pixels')
 rotated=a[:,::-1].T
 return [((rotated[:,c*600:c*600+600:2]<<4)|rotated[:,c*600+1:c*600+600:2]).tobytes() for c in range(2)]

def write_frame(path,indices):
 chunks=native_bytes(indices);wire=bytearray();sizes=[]
 for chip in chunks:
  for offset in range(0,len(chip),4800):
   block=compress_block(chip[offset:offset+4800])
   assert 0<len(block)<=4864
   wire+=struct.pack('<H',len(block))+block;sizes.append(len(block))
 path=Path(path);path.write_bytes(wire)
 return dict(file=path.name,format='chip 1 then 2; 100 blocks each; LE16 zlib length + 4800-byte decompressed block',sha256=hashlib.sha256(wire).hexdigest(),bytes=len(wire),native_bytes_per_chip=480000,fnv32=[fnv(c) for c in chunks],sha256_per_chip=[hashlib.sha256(c).hexdigest() for c in chunks],blocks=len(sizes),largest_block=max(sizes))

def compile_plan(profile,index_image,output,allow_provisional=False):
 """profile entries reference complete, previously measured LUT uploads."""
 profile_path=Path(profile);profile=json.loads(profile_path.read_text())
 if profile.get('invalidated'):raise ValueError('Profile was invalidated by later measurements')
 entries=profile['entries'];index_image=np.asarray(index_image)
 if index_image.shape!=(1200,1600) or index_image.min()<0 or index_image.max()>=len(entries):raise ValueError('Invalid palette index image')
 used=sorted(map(int,np.unique(index_image)));selected=[entries[i] for i in used]
 if any(e['status']!='confirmed' for e in selected) and not allow_provisional:raise ValueError('Palette is provisional; explicit experimental mode required')
 out=Path(output);out.mkdir(parents=True,exist_ok=True)
 histories=np.array([e['native_preparation'] for e in entries],dtype=np.uint8)[index_image]
 if not np.isin(histories,[0,1,2,3,5,6]).all():raise ValueError('Unknown native color')
 steps=[dict(kind='native_preparation',frame=write_frame(out/'00-native.z16',histories),expected_refresh_seconds=profile.get('native_refresh_seconds',36))]
 groups={}
 # Keep all four measured LUT passes even when an image uses only a subset.
 for i in range(len(entries)):
  e=entries[i]
  if e.get('native_only'):continue
  groups.setdefault(e['lut_sha256'],[]).append(i)
 preservation=[];completed=set()
 # Minimize subsequent Source0 exposure for newly formed states. This ordering
 # is a heuristic; it never substitutes for measured preservation evidence.
 measured_order=profile.get('measured_lut_order')
 if measured_order:
  assert set(groups)==set(measured_order),'The measured LUT set must be complete; retain the witness strip'
  ordered=sorted(groups.items(),key=lambda item:measured_order.index(item[0]))
 else:ordered=sorted(groups.items(),key=lambda item:entries[item[1][0]]['refresh_seconds'],reverse=True)
 for number,(sha,ids) in enumerate(ordered,1):
  recipes=[entries[i] for i in ids];first=recipes[0];lut=(profile_path.parent/first['lut_file']).read_bytes()
  if len(lut)!=2048 or hashlib.sha256(lut).hexdigest()!=sha:raise ValueError('LUT upload hash mismatch')
  hold=first['hold_bank']
  if not 0<=hold<=7:raise ValueError('Hold bank out of range')
  raster=np.full(index_image.shape,hold,dtype=np.uint8)
  for i in ids:
   e=entries[i]
   if not 0<=e['bank']<=7:raise ValueError('Bank out of range')
   raster[index_image==i]=e['bank']
  for i in used:
   if i not in ids:
    final_state=i in completed and not entries[i].get('native_only')
    evidence=entries[i].get('preserved_by_luts',[]) if final_state else profile.get('native_preservation',{}).get(str(entries[i]['native_preparation']),[])
    scope=entries[i].get('preserved_by_luts_scope') if final_state else profile.get('native_preservation_scope')
    verified=sha in evidence and scope=='whole_pass_including_PON_POF'
    preservation.append(dict(entry=entries[i]['id'],subsequent_lut=sha,state='written_recipe' if final_state else 'native_preparation',native_history=entries[i]['native_preparation'],evidence_scope=scope or 'unspecified_or_pre_DRF_only',verified=verified))
    if not verified and not allow_provisional:raise ValueError('Inactive-state preservation not measured')
  lut_name=f'{number:02d}-lut.bin';(out/lut_name).write_bytes(lut)
  steps.append(dict(kind='custom_waveform',lut_file=lut_name,lut_sha256=sha,lut_fnv32=fnv(lut),frame=write_frame(out/f'{number:02d}-mask.z16',raster),entry_ids=[entries[i]['id'] for i in ids],hold_bank=hold,expected_refresh_seconds=first['refresh_seconds']))
  completed.update(ids)
 # This conservative estimate includes UART wire time, SPI writes and existing cooldown.
 estimated=sum(s['frame']['bytes']*10/115200+2+s['expected_refresh_seconds'] for s in steps)+10*(len(steps)-1)
 plan=dict(version=1,width=1600,height=1200,profile_sha256=hashlib.sha256(profile_path.read_bytes()).hexdigest(),palette_entries_used=len(used),steps=steps,pass_ordering='Exact measured_lut_order from the repeated calibration sequence' if measured_order else 'Longest measured refresh first; heuristic, not proof of preservation',spatial_dithering=profile.get('spatial_dithering','specified by input index image'),continuous_temporal_mixing=False,preservation_checks=preservation,experimental=allow_provisional,estimated_seconds=estimated,estimated_within_120_seconds=estimated<=120,actual_elapsed_seconds=None)
 (out/'plan.json').write_text(json.dumps(plan,indent=2));return plan
