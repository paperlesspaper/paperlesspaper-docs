"use client";

import { useId, useRef, useState } from "react";
import observations from "./transition-data.json";
import styles from "./color-transition-atlas.module.css";

const colors = [
  ["white", "White", "#faf9ec"], ["black", "Black", "#24262c"],
  ["yellow", "Yellow", "#edcb39"], ["red", "Red", "#bf4842"],
  ["blue", "Blue", "#36669e"], ["green", "Green", "#39806b"],
];
type Run = {
  file: string; source: string; drive: number; rate: number; onset: number | null;
  settle: number | null; turns: [number, string][]; trace: number[][];
  darkFlashes: number; brightFlashes: number; flashWindows: [string, number, number][];
  quality?: "match" | "approximation" | "miss";
  recipe: string; endpoint: string; run: string;
};
const pairs = observations as unknown as Record<string, { native: Run; partials: Run[] }>;
const outcomes = {
  match: "Target matched",
  approximation: "Approximation",
  miss: "Target missed",
};
const media = "/panels/transition-atlas/";
const sec = (n: number | null) => n === null ? "Unresolved" : n.toLocaleString("en-GB", {maximumFractionDigits: 3}) + " s";
const rgb = (p: number[]) => `rgb(${p.slice(1).join(",")})`;
const luminance = (p: number[]) => .2126*p[1] + .7152*p[2] + .0722*p[3];

function Curve({run}: {run: Run}) {
  const id = useId().replace(/:/g, "");
  const pts = run.trace.filter(p => p[0] >= 0);
  const end = pts[pts.length-1][0];
  const x = (t: number) => 12 + 576*t/end;
  const y = (l: number) => 79 - 64*l/255;
  const path = pts.map(p => [x(p[0]), y(luminance(p))].join(",")).join(" ");
  return <figure className={styles.curve}>
    <figcaption>Colour and brightness in the camera patch</figcaption>
    <svg viewBox="0 0 600 104" role="img" aria-label={`Recorded colour and brightness over ${sec(end)}. ${run.turns.length} brightness reversals.`}>
      <defs><linearGradient id={id}>{pts.map((p,i)=><stop key={i} offset={p[0]/end} stopColor={rgb(p)}/>)}</linearGradient></defs>
      <path d="M12 15H588 M12 47H588 M12 79H588" stroke="currentColor" opacity=".16" fill="none"/>
      <polyline points={path} fill="none" stroke="currentColor" strokeWidth="2"/>
      <rect x="12" y="86" width="576" height="14" rx="3" fill={`url(#${id})`}/>
      <path d={`M${x(run.drive)} 8V101`} stroke="currentColor" strokeDasharray="3 3"/>
      {run.turns.map(([t],i)=>{const p=pts.reduce((a,b)=>Math.abs(a[0]-t)<Math.abs(b[0]-t)?a:b);return <circle key={i} cx={x(t)} cy={y(luminance(p))} r="3" fill="currentColor"/>;})}
    </svg>
    <div className={styles.scale}><span>0 s · Start</span><span>┆ Drive ends</span><span>{sec(end)}</span></div>
  </figure>;
}

function Ink({run, from, to}: {run: Run; from: string; to: string}) {
  const pts=run.trace;
  const start=pts[0],end=pts[pts.length-1];
  const intermediate=run.turns[0]?.[0] ?? ((run.onset??0)+(run.settle??run.drive))/2;
  const mid=pts.reduce((a,b)=> Math.abs(a[0]-intermediate)<Math.abs(b[0]-intermediate)?a:b);
  return <figure className={styles.ink}>
    <figcaption>Inside the pixel</figcaption>
    <div className={styles.phases}>
      {[[from,"Starting state",start],["Field applied",sec(mid[0]),mid],[to,"End state",end]].map((entry,i)=>{
        const [label,time,p]=entry as [string,string,number[]];
        const single=["White","Red","Yellow","Blue"].indexOf(label);
        const mixed=i!==1 && single<0;
        return <div key={i}><svg viewBox="0 0 120 71" role="img" aria-label={`Pixel cross-section (schematic), ${label}`}>
          <rect x="7" y="9" width="106" height="53" rx="6" fill="#eef1ed" stroke="#687472"/>
          <rect x="8" y="10" width="104" height="8" rx="2" fill={rgb(p)}/>
          <path d="M11 66H109" stroke="#596967" strokeWidth="3"/>
          {[0,1,2,3].map((n)=><circle key={n} cx={25+n*22} cy={i===1?[43,27,49,35][n]:n===single?25:mixed?43:47+(n%2)*4} r="5" fill={["#fff","#c34b43","#e5be39","#3866a2"][n]} stroke="#596668"/>)}
          {mixed&&label!=="Measured endpoint"&&<text x="60" y="30" textAnchor="middle" fill="#405454" fontSize="10">Mixed state</text>}
          {i===1&&<path d="M36 47V28m-4 4 4-5 4 5m28-7v19m-4-4 4 5 4-5" fill="none" stroke="#354741" strokeWidth="2"/>}
        </svg><strong>{label}</strong><small>{time}</small></div>;
      })}
    </div>
    <p>The top strip shows the recorded colour. The dots illustrate the four pigments. An electric field moves charged particles through the ink. Their distribution near the viewing surface changes the light reflected back to the camera. The drawing is schematic.</p>
  </figure>;
}

export function ColorTransitionAtlas() {
  const [selection,setSelection]=useState(["white","blue"]);
  const [variant,setVariant]=useState(0);
  const [original,setOriginal]=useState(false);
  const video=useRef<HTMLVideoElement>(null);
  const [from,to]=selection;const key=from+"-"+to;
  const pair=pairs[key];const runs=[...pair.partials,pair.native];const run=runs[variant];
  const label=(key:string)=>colors.find(c=>c[0]===key)![1];
  function choose(a:string,b:string){setSelection([a,b]);setVariant(0);setOriginal(false);}
  function speed(real:boolean){setOriginal(real);if(video.current)video.current.playbackRate=real?1/run.rate:1;}
  return <section className={`not-prose ${styles.atlas}`} lang="en">
    <table className={styles.matrix}><caption>Choose the starting colour by row and the target by column.</caption>
      <thead><tr><th scope="col">From ↓<br/>To →</th>{colors.map(([id,name,tint])=><th key={id} scope="col"><i style={{background:tint}}/>{name}</th>)}</tr></thead>
      <tbody>{colors.map(([a,an,ac])=><tr key={a}><th scope="row"><i style={{background:ac}}/>{an}</th>{colors.map(([b,bn])=>{
        if(a===b)return <td key={b} aria-label="Hold the same colour">–</td>;
        const cell=pairs[a+"-"+b];
        const quality=cell.partials[0]?.quality;
        const offTarget=quality==="approximation" || quality==="miss";
        const first=cell.partials[0]??cell.native;
        const count=first.darkFlashes+first.brightFlashes;
        return <td key={b}><button type="button" onClick={()=>choose(a,b)} aria-pressed={from===a&&to===b} aria-label={an+" to "+bn} title={an+" → "+bn+" · "+count+" flashes"+(quality?" · "+outcomes[quality]:"")} className={styles.alternative}>{count}{offTarget&&<sup>†</sup>}</button></td>;
      })}</tr>)}</tbody>
    </table>
    <p className={styles.legend}>Numbers count dark and bright flashes in the partial-drive clip. A dagger (†) marks a trial outside the target tolerance. A dash means the colour can be held.</p>
    <div className={styles.heading}><h2 aria-live="polite">{label(from)} → {label(to)}</h2><button type="button" onClick={()=>choose(to,from)}>Reverse direction ↔</button></div>
    {runs.length>1&&<div className={styles.variants} role="group" aria-label="Drive">{runs.map((r,i)=><button type="button" key={r.file} aria-pressed={variant===i} onClick={()=>{setVariant(i);setOriginal(false);}}>{r.source}</button>)}</div>}
    <div className={styles.detail}>
      <div><video controls playsInline preload="metadata" key={run.file} ref={video} poster={media+run.file+".webp"} src={media+run.file+".mp4"} aria-label={label(from)+" to "+label(to)+", "+run.source} onLoadedMetadata={()=>{if(video.current)video.current.playbackRate=original?1/run.rate:1;}}/>
        {run.rate>1?<div className={styles.speeds} role="group" aria-label="Playback speed"><button type="button" aria-pressed={!original} onClick={()=>speed(false)}>Quick view · 4×</button><button type="button" aria-pressed={original} onClick={()=>speed(true)}>Real time · 1×</button></div>:<small>Camera footage at actual speed</small>}
      </div>
      <dl className={styles.metrics}>{[["Drive",sec(run.drive)],["First visible change",sec(run.onset)],["Optically stable by",sec(run.settle)],["Brightness reversals",String(run.turns.length)],["Dark / bright flashes",run.darkFlashes+" / "+run.brightFlashes]].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </div>
    <p className={styles.note}>{run.quality&&<strong className={styles.outcome} data-assessment={run.quality}>{outcomes[run.quality]}</strong>}<b>{run.recipe}.</b> {run.endpoint} {run.turns.length===0?"No brightness reversal crossed the detection threshold in this patch.":`First measured ${run.turns[0][1]==="bright"?"peak":"trough"} at ${sec(run.turns[0][0])}.`}</p>
    {run.flashWindows.length>0&&<details className={styles.flashTimes}>
      <summary>Flash timing ({run.flashWindows.length})</summary>
      <ol>{run.flashWindows.map(([kind,start,end],i)=><li key={i}>{kind} · {sec(start)}{end>start?" – "+sec(end):" (one sample)"}</li>)}</ol>
    </details>}
    <Curve run={run}/><Ink run={run} from={label(from)} to={run.quality==="miss"||run.quality==="approximation"?"Measured endpoint":label(to)}/>
  </section>;
}
