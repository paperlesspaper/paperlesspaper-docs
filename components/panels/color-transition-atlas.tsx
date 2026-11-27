"use client";

import { useId, useRef, useState } from "react";
import observations from "./transition-data.json";
import styles from "./color-transition-atlas.module.css";

const colors = [
  ["white", "Weiß", "#faf9ec"], ["black", "Schwarz", "#24262c"],
  ["yellow", "Gelb", "#edcb39"], ["red", "Rot", "#bf4842"],
  ["blue", "Blau", "#36669e"], ["green", "Grün", "#39806b"],
];
type Run = {
  file: string; source: string; drive: number; rate: number; onset: number | null;
  settle: number | null; turns: [number, string][]; trace: number[][];
  recipe: string; endpoint: string; run: string;
};
const pairs = observations as unknown as Record<string, { native: Run; partials: Run[] }>;
const media = "/panels/transition-atlas/";
const sec = (n: number | null) => n === null ? "offen" : n.toLocaleString("de-DE", {maximumFractionDigits: 2}) + " s";
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
    <figcaption>Farbe und Helligkeit im Kamerafeld</figcaption>
    <svg viewBox="0 0 600 104" role="img" aria-label={`Gemessene Farbe und Helligkeit über ${sec(end)}. ${run.turns.length} deutliche Helligkeitsumkehrungen.`}>
      <defs><linearGradient id={id}>{pts.map((p,i)=><stop key={i} offset={p[0]/end} stopColor={rgb(p)}/>)}</linearGradient></defs>
      <path d="M12 15H588 M12 47H588 M12 79H588" stroke="currentColor" opacity=".16" fill="none"/>
      <polyline points={path} fill="none" stroke="currentColor" strokeWidth="2"/>
      <rect x="12" y="86" width="576" height="14" rx="3" fill={`url(#${id})`}/>
      <path d={`M${x(run.drive)} 8V101`} stroke="currentColor" strokeDasharray="3 3"/>
      {run.turns.map(([t],i)=>{const p=pts.reduce((a,b)=>Math.abs(a[0]-t)<Math.abs(b[0]-t)?a:b);return <circle key={i} cx={x(t)} cy={y(luminance(p))} r="3" fill="currentColor"/>;})}
    </svg>
    <div className={styles.scale}><span>0 s · Start</span><span>┆ Ende der Ansteuerung</span><span>{sec(end)}</span></div>
  </figure>;
}

function Ink({run, from, to}: {run: Run; from: string; to: string}) {
  const pts=run.trace;
  const start=pts[0],end=pts[pts.length-1];
  const intermediate=run.turns[0]?.[0] ?? ((run.onset??0)+(run.settle??run.drive))/2;
  const mid=pts.reduce((a,b)=> Math.abs(a[0]-intermediate)<Math.abs(b[0]-intermediate)?a:b);
  return <figure className={styles.ink}>
    <figcaption>Was sich im Pixel ändert</figcaption>
    <div className={styles.phases}>
      {[[from,"Ausgangszustand",start],["Feld aktiv",sec(mid[0]),mid],[to,"Endzustand",end]].map((entry,i)=>{
        const [label,time,p]=entry as [string,string,number[]];
        const single=["Weiß","Rot","Gelb","Blau"].indexOf(label);
        const mixed=i!==1 && single<0;
        return <div key={i}><svg viewBox="0 0 120 71" role="img" aria-label={`Schematischer Pixelquerschnitt, ${label}`}>
          <rect x="7" y="9" width="106" height="53" rx="6" fill="#eef1ed" stroke="#687472"/>
          <rect x="8" y="10" width="104" height="8" rx="2" fill={rgb(p)}/>
          <path d="M11 66H109" stroke="#596967" strokeWidth="3"/>
          {[0,1,2,3].map((n)=><circle key={n} cx={25+n*22} cy={i===1?[43,27,49,35][n]:n===single?25:mixed?43:47+(n%2)*4} r="5" fill={["#fff","#c34b43","#e5be39","#3866a2"][n]} stroke="#596668"/>)}
          {mixed&&<text x="60" y="30" textAnchor="middle" fill="#405454" fontSize="10">Mischzustand</text>}
          {i===1&&<path d="M36 47V28m-4 4 4-5 4 5m28-7v19m-4-4 4 5 4-5" fill="none" stroke="#354741" strokeWidth="2"/>}
        </svg><strong>{label}</strong><small>{time}</small></div>;
      })}
    </div>
    <p>Der obere Streifen zeigt die Kamerafarbe. Darunter veranschaulichen die Punkte die vier Pigmente. Das elektrische Feld verschiebt geladene Teilchen. Ihre Verteilung an der Sichtseite bestimmt, welches Licht zurückgestreut wird. Die tatsächlichen Teilchenbahnen und Elektrodenspannungen lassen sich aus der Aufnahme allein nicht bestimmen.</p>
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
  return <section className={`not-prose ${styles.atlas}`} lang="de">
    <table className={styles.matrix}><caption>Zeile wählen für die Ausgangsfarbe, Spalte für die Zielfarbe.</caption>
      <thead><tr><th scope="col">Von ↓<br/>Nach →</th>{colors.map(([id,name,tint])=><th key={id} scope="col"><i style={{background:tint}}/>{name}</th>)}</tr></thead>
      <tbody>{colors.map(([a,an,ac])=><tr key={a}><th scope="row"><i style={{background:ac}}/>{an}</th>{colors.map(([b,bn])=>{
        if(a===b)return <td key={b} aria-label="Gleiche Farbe">–</td>;
        const cell=pairs[a+"-"+b];const partial=cell.partials.length>0;
        const count=(cell.partials[0]??cell.native).turns.length;
        return <td key={b}><button type="button" onClick={()=>choose(a,b)} aria-pressed={from===a&&to===b} aria-label={an+" nach "+bn} title={an+" → "+bn+" · "+count+" Helligkeitsumkehrungen"} className={partial?styles.alternative:undefined}>{count}{partial&&<sup>•</sup>}</button></td>;
      })}</tr>)}</tbody>
    </table>
    <p className={styles.legend}>Zahl = gemessene Helligkeitsumkehrungen im zuerst gezeigten Film. • Teilansteuerung verfügbar. – Farbe halten.</p>
    <div className={styles.heading}><h2 aria-live="polite">{label(from)} → {label(to)}</h2><button type="button" onClick={()=>choose(to,from)}>Richtung umkehren ↔</button></div>
    {runs.length>1&&<div className={styles.variants} role="group" aria-label="Ansteuerung">{runs.map((r,i)=><button type="button" key={r.file} aria-pressed={variant===i} onClick={()=>{setVariant(i);setOriginal(false);}}>{r.source}</button>)}</div>}
    <div className={styles.detail}>
      <div><video controls playsInline preload="metadata" key={run.file} ref={video} poster={media+run.file+".webp"} src={media+run.file+".mp4"} aria-label={label(from)+" nach "+label(to)+", "+run.source} onLoadedMetadata={()=>{if(video.current)video.current.playbackRate=original?1/run.rate:1;}}/>
        {run.rate>1?<div className={styles.speeds} role="group" aria-label="Abspieltempo"><button type="button" aria-pressed={!original} onClick={()=>speed(false)}>Kurzfilm · 4×</button><button type="button" aria-pressed={original} onClick={()=>speed(true)}>Echtzeit · 1×</button></div>:<small>Kameraaufnahme in Echtzeit</small>}
      </div>
      <dl className={styles.metrics}>{[["Ansteuerung",sec(run.drive)],["Erste sichtbare Änderung",sec(run.onset)],["Optisch stabil ab",sec(run.settle)],["Helligkeitsumkehrungen",String(run.turns.length)]].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </div>
    <p className={styles.note}><b>{run.recipe}.</b> {run.endpoint} {run.turns.length===0?"In diesem Messfeld wurde keine deutliche Helligkeitsumkehr erfasst.":`Erster gemessener ${run.turns[0][1]==="hell"?"Hochpunkt":"Tiefpunkt"} nach ${sec(run.turns[0][0])}.`}</p>
    <Curve run={run}/><Ink run={run} from={label(from)} to={label(to)}/>
  </section>;
}
