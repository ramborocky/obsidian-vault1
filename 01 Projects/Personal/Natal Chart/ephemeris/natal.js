const E=require('./ephemeris.js');
const {jd,ayan,sunLon,moonLon,rahu,planetLon,ascend,mc,fmt,NAK,SG,LORD,YRS,norm}=E;
const LAT=-6.8163, LON=39.2803, TZ=3;
// 20 Oct 1977, 02:37 EAT — rectified from a remembered "02:00".
// Magha rises 02:20-03:08; 02:37 puts the ascendant exactly on natal Saturn.
// Confirmed by Saturn transiting Aquarius (7th from Leo) Jan 2023 - Mar 2025.
const J=jd(1977,10,20,2.6167-TZ);
const ay=ayan(J);
const sid=x=>norm(x-ay);
const body={
 Ascendant: sid(ascend(J,LAT,LON)),
 MC:        sid(mc(J,LON)),
 Sun:       sid(sunLon(J)),
 Moon:      sid(moonLon(J)),
 Mercury:   sid(planetLon('Mercury',J)),
 Venus:     sid(planetLon('Venus',J)),
 Mars:      sid(planetLon('Mars',J)),
 Jupiter:   sid(planetLon('Jupiter',J)),
 Saturn:    sid(planetLon('Saturn',J)),
 Rahu:      sid(rahu(J)),
 Ketu:      norm(sid(rahu(J))+180)};
const asc=body.Ascendant;
console.log(`NATAL  20 Oct 1977, 02:37 EAT, Dar es Salaam   [Lahiri ayanamsa ${ay.toFixed(4)}]\n`);
console.log("body        sidereal position                          house  R");
for(const[k,v]of Object.entries(body)){
 const h=Math.floor(norm(v-Math.floor(asc/30)*30)/30)+1;
 let rx='';
 if(!['Ascendant','MC','Sun','Moon','Rahu','Ketu'].includes(k)){
   const d=norm(planetLon(k,J+1)-planetLon(k,J)); rx=(d>180||d<0)?'Rx':'';}
 if(k==='Rahu'||k==='Ketu')rx='Rx';
 console.log(`${k.padEnd(11)} ${fmt(v)}   ${String(k==='MC'?'-':h).padStart(4)}   ${rx}`);}

/* ---- Vimshottari from Moon ---- */
const mn=body.Moon, ni=Math.floor(mn/(360/27)), frac=(mn%(360/27))/(360/27);
const start=LORD.indexOf(LORD[ni%9]);
console.log(`\nJanma nakshatra : ${NAK[ni]} pada ${Math.floor((mn%(360/27))/(360/108))+1}   (${(frac*100).toFixed(1)}% elapsed)`);
console.log(`Janma rashi     : ${SG[Math.floor(mn/30)]}`);
const YR=365.2425;
let t=J-(1-frac)*0; let cur=J-frac*YRS[LORD[ni%9]]*YR;  // notional MD start
console.log(`Birth dasha     : ${LORD[ni%9]}, balance ${((1-frac)*YRS[LORD[ni%9]]).toFixed(2)} yrs\n`);
const NOW=jd(2026,8,26,12-TZ);
const gd=Jd=>{let z=Math.floor(Jd+0.5),f=Jd+0.5-z;let a=z;
 if(z>=2299161){const al=Math.floor((z-1867216.25)/36524.25);a=z+1+al-Math.floor(al/4);}
 const b=a+1524,c=Math.floor((b-122.1)/365.25),d=Math.floor(365.25*c),e=Math.floor((b-d)/30.6001);
 const day=b-d-Math.floor(30.6001*e)+f, mo=e<14?e-1:e-13, yr=mo>2?c-4716:c-4715;
 return `${yr}-${String(mo).padStart(2,'0')}-${String(Math.floor(day)).padStart(2,'0')}`;};
console.log("MAHADASHA sequence");
let p=cur, i=ni%9;
for(let n=0;n<10;n++){const L=LORD[i%9], dur=YRS[L]*YR, end=p+dur;
 const live=(NOW>=p&&NOW<end);
 if(end>jd(1977,1,1,0)&&p<jd(2045,1,1,0))
  console.log(`  ${L.padEnd(8)} ${gd(p)} -> ${gd(end)} ${live?'   <<< CURRENT':''}`);
 if(live){ // antardasha
  let q=p, j=i;
  console.log("     antardasha:");
  for(let m=0;m<9;m++){const A=LORD[j%9], ad=dur*YRS[A]/120, ae=q+ad;
   const al=(NOW>=q&&NOW<ae);
   console.log(`       ${L}/${A.padEnd(8)} ${gd(q)} -> ${gd(ae)}${al?'   <<< NOW':''}`);
   q=ae; j++;}}
 p=end; i++;}
