const D=Math.PI/180,R=180/Math.PI;
const LAT=-6.8163, LON=39.2803, TZ=3;
const jd=(y,m,d)=>{if(m<=2){y--;m+=12}const a=Math.floor(y/100),b=2-a+Math.floor(a/4);
 return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+b-1524.5};
function riseSet(J){
 const n=J-2451545.0;
 const L=(280.460+0.9856474*n)%360, g=(357.528+0.9856003*n)%360;
 const lam=(L+1.915*Math.sin(g*D)+0.020*Math.sin(2*g*D))%360;
 const eps=23.439-0.0000004*n;
 const dec=Math.asin(Math.sin(eps*D)*Math.sin(lam*D))*R;
 let RA=Math.atan2(Math.cos(eps*D)*Math.sin(lam*D),Math.cos(lam*D))*R; RA=(RA%360+360)%360;
 let eot=4*(((L-RA)%360+540)%360-180);                    // minutes
 const noon=12-eot/60+(15*TZ-LON)/15;
 const cosH=(Math.sin(-0.833*D)-Math.sin(LAT*D)*Math.sin(dec*D))/(Math.cos(LAT*D)*Math.cos(dec*D));
 const H=Math.acos(Math.max(-1,Math.min(1,cosH)))*R/15;
 return [noon-H, noon+H];}
const CHAL=["Saturn","Jupiter","Mars","Sun","Venus","Mercury","Moon"];
const DAYR=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
const DN=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const GOOD=new Set(["Sun","Mars","Jupiter"]), WATCH=new Set(["Saturn"]);
const hm=h=>{h=(h%24+24)%24;return `${String(Math.floor(h)).padStart(2,'0')}:${String(Math.round((h%1)*60)).padStart(2,'0')}`};
const MN=["Aug","Sep"];
console.log("PLANETARY HOURS — Dar es Salaam, unequal hours measured from sunrise");
console.log("✓ = Sun / Mars / Jupiter (your lagna lord, your yogakāraka, your daśā lord)");
console.log("⚠ = Saturn (rules your 6th and 7th, sits on your ascendant)\n");
for(let d=0; d<7; d++){
 const dd=26+d, J=jd(2026,8,dd);
 const dow=(Math.floor(J+1.5)%7+7)%7;
 const [rise,set]=riseSet(J);
 const dayH=(set-rise)/12, nightH=(24-(set-rise))/12;
 const i=CHAL.indexOf(DAYR[dow]);
 const lbl=dd>31?`${dd-31} Sep`:`${dd} Aug`;
 console.log(`${DN[dow].padEnd(10)} ${lbl.padEnd(7)} ruler ${DAYR[dow].padEnd(8)} sunrise ${hm(rise)}  sunset ${hm(set)}  (day-hour ${Math.round(dayH*60)}m)`);
 const rows=[];
 for(let h=0;h<12;h++){const p=CHAL[(i+h)%7];
  if(GOOD.has(p)||WATCH.has(p))rows.push(`${hm(rise+h*dayH)}–${hm(rise+(h+1)*dayH)} ${p}${GOOD.has(p)?'✓':'⚠'}`);}
 console.log("   daylight : "+rows.join("   "));
 const rows2=[];
 for(let h=0;h<12;h++){const p=CHAL[(i+12+h)%7];
  if(GOOD.has(p)||WATCH.has(p))rows2.push(`${hm(set+h*nightH)}–${hm(set+(h+1)*nightH)} ${p}${GOOD.has(p)?'✓':'⚠'}`);}
 console.log("   night    : "+rows2.join("   ")+"\n");}
