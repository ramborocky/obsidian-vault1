const E=require('./ephemeris.js');
const {jd,ayan,planetLon,fmt,norm,SG}=E;
const NM=278.42;
const gd=J=>{let z=Math.floor(J+0.5),f=J+0.5-z,a=z;
 if(z>=2299161){const al=Math.floor((z-1867216.25)/36524.25);a=z+1+al-Math.floor(al/4);}
 const b=a+1524,c=Math.floor((b-122.1)/365.25),d=Math.floor(365.25*c),e=Math.floor((b-d)/30.6001);
 const day=b-d-Math.floor(30.6001*e)+f,mo=e<14?e-1:e-13,yr=mo>2?c-4716:c-4715;
 const M=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 return `${String(Math.floor(day)).padStart(2)} ${M[mo-1]} ${yr}`;};
const S=J=>norm(planetLon('Saturn',J)-ayan(J));
const relOf=J=>Math.floor(norm(S(J)-Math.floor(NM/30)*30)/30)+1;
const V={3:"BEST — classical: strength rewarded, opposition gives way",
 4:"HARD — kantaka / ardhashtama shani, one of the difficult transits",
 5:"mixed",6:"GOOD — upachaya, Saturn does well here"};
console.log("Saturn relative to your natal Moon (Capricorn), scanned forward:\n");
let prev=relOf(jd(2025,1,1,0)), pj=jd(2025,1,1,0);
for(let J=jd(2025,1,1,0); J<jd(2036,1,1,0); J+=0.5){
 const r=relOf(J);
 if(r!==prev){
  console.log(`  ${gd(J).padEnd(12)} Saturn enters ${SG[Math.floor(S(J)/30)].padEnd(10)} = ${String(r).padStart(2)}${r===3?'rd':r===4?'th':r===2?'nd':'th'} from Moon   ${V[r]||''}`);
  prev=r;}}
const T=jd(2026,8,26,9);
console.log(`\n  TODAY: Saturn ${fmt(S(T))} — ${relOf(T)}rd from the natal Moon, ${Math.abs(((norm(S(T)-NM)+180)%360)-180).toFixed(1)}° away and widening.`);
