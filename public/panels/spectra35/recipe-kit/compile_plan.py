"""Offline only: exact Spectra35 tokens -> native preparation + four LUT masks."""
from pathlib import Path
import argparse,json
import numpy as np
from PIL import Image
from planner import compile_plan
ROOT=Path(__file__).resolve().parent

def convert(source,output):
    with Image.open(source) as im:
        if im.size!=(1600,1200):raise ValueError('Expected 1600x1200; fit/rotate BEFORE dithering')
        a=np.asarray(im.convert('RGBA'))
    if not np.all(a[:,:,3]==255):raise ValueError('Recipe tokens must be opaque')
    palette=json.loads((ROOT/'palette.json').read_text())
    packed=(a[:,:,0].astype(np.uint32)<<16)|(a[:,:,1].astype(np.uint32)<<8)|a[:,:,2]
    lookup={int(e['deviceColor'][1:],16):i for i,e in enumerate(palette)}
    unique,inverse=np.unique(packed,return_inverse=True)
    if any(int(k) not in lookup for k in unique):raise ValueError('Unknown token: use a lossless token PNG, without resizing or color conversion')
    indices=np.array([lookup[int(k)] for k in unique],np.uint8)[inverse].reshape(1200,1600)
    output=Path(output);output.mkdir(parents=True,exist_ok=False)
    Image.fromarray(indices).save(output/'indices.png')
    result=compile_plan(ROOT/'profile.json',indices,output/'passes',True)
    if len(result['steps'])!=5:raise ValueError('Expected native preparation and all four measured LUTs')
    return result

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('device_png');parser.add_argument('output')
    args=parser.parse_args();print(json.dumps(convert(args.device_png,args.output),indent=2))
