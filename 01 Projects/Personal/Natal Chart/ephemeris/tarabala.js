const E=require('./ephemeris.js');
const {jd,ayan,moonLon,NAK,norm}=E;
const TZ=3;
const gd=J=>{let z=Math.floor(J+0.5),f=J+0.5-z,a=z;
 if(z>=2299161){const al=Math.floor((z-1867216.25)/36524.25);a=z+1+al-Math.floor(al/4);}
 const b=a+1524,c=Math.floor((b-122.1)/365.25),d=Math.floor(365.25*c),e=Math.floor((b-d)/30.6001);
 const day=b-d-Math.floor(30.6001*e)+f,mo=e<14?e-1:e-13,yr=mo>2?c-4716:c-4715;
 const M=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 return {s:`${String(Math.floor(day)).padStart(2)} ${M[mo-1]}`,y:yr,m:M[mo-1]};};
const BADN=[2,4,6,11,13,15,20,22,24].map(i=>(20+i)%27);
const BEST=[8,17,26].map(i=>(20+i)%27);   // Ati-Mitra: Bharani, P.Phalguni, P.Ashadha
console.log("CLEAR WINDOWS  (no Vipat / Pratyari / Vadha)  ★ = Ati-Mitra day inside\n");
let run=null, mo=null;
for(let J=jd(2026,8,29,-TZ); J<jd(2027,7,1,0); J+=1/24){
 const n=Math.floor(norm(moonLon(J)-ayan(J))/(360/27));
 if(!BADN.includes(n)){ if(run===null)run={a:J,best:false}; if(BEST.includes(n))run.best=true; }
 else if(run){ const len=(J-run.a);
   if(len>=2.0){const A=gd(run.a),B=gd(J);
     if(A.m+A.y!==mo){console.log(`\n  ── ${A.m} ${A.y} ──`);mo=A.m+A.y;}
     console.log(`   ${A.s} → ${B.s}   ${len.toFixed(1).padStart(4)} days ${run.best?'★':' '}`);}
   run=null;}}
