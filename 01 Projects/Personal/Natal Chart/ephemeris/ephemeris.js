const D=Math.PI/180, R=180/Math.PI;
const sin=x=>Math.sin(x*D), cos=x=>Math.cos(x*D), tan=x=>Math.tan(x*D);
const norm=x=>((x%360)+360)%360;
const jd=(y,m,d,h)=>{if(m<=2){y--;m+=12}const a=Math.floor(y/100),b=2-a+Math.floor(a/4);
 return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+b-1524.5+h/24};
const Tc=J=>(J-2451545.0)/36525.0;
const ayan=J=>23.85305+(J-2451545.0)/365.25*0.01396;   // Lahiri

/* ---------- Sun (Meeus 25, low precision ~0.01deg) ---------- */
function sunLon(J){const T=Tc(J);
 const L0=norm(280.46646+36000.76983*T+0.0003032*T*T);
 const M=norm(357.52911+35999.05029*T-0.0001537*T*T);
 const C=(1.914602-0.004817*T-0.000014*T*T)*sin(M)+(0.019993-0.000101*T)*sin(2*M)+0.000289*sin(3*M);
 return norm(L0+C-0.00569);}

/* ---------- Moon (Meeus 47, main periodic terms) ---------- */
const MT=[[0,0,1,0,6288774],[2,0,-1,0,1274027],[2,0,0,0,658314],[0,0,2,0,213618],
[0,1,0,0,-185116],[0,0,0,2,-114332],[2,0,-2,0,58793],[2,-1,-1,0,57066],[2,0,1,0,53322],
[2,-1,0,0,45758],[0,1,-1,0,-40923],[1,0,0,0,-34720],[0,1,1,0,-30383],[2,0,0,-2,15327],
[0,0,1,2,-12528],[0,0,1,-2,10980],[4,0,-1,0,10675],[0,0,3,0,10034],[4,0,-2,0,8548],
[2,1,-1,0,-7888],[2,1,0,0,-6766],[1,0,-1,0,-5163],[1,1,0,0,4987],[2,-1,1,0,4036],
[2,0,2,0,3994],[4,0,0,0,3861],[2,0,-3,0,3665],[0,1,-2,0,-2689],[2,0,-1,2,-2602],
[2,-1,-2,0,2390],[1,0,1,0,-2348],[2,-2,0,0,2236],[0,1,2,0,-2120],[0,2,0,0,-2069],
[2,-2,-1,0,2048],[2,0,1,-2,-1773],[2,0,0,2,-1595],[4,-1,-1,0,1215],[0,0,2,2,-1110],
[3,0,-1,0,-892],[2,1,1,0,-810],[4,-1,-2,0,759],[0,2,-1,0,-713],[2,2,-1,0,-700],
[2,1,-2,0,691],[2,-1,0,-2,596],[4,0,1,0,549],[0,0,4,0,537],[4,-1,0,0,520],[1,0,-2,0,-487]];
function moonLon(J){const T=Tc(J);
 const Lp=norm(218.3164477+481267.88123421*T-0.0015786*T*T+T*T*T/538841-T**4/65194000);
 const Dd=norm(297.8501921+445267.1114034*T-0.0018819*T*T+T*T*T/545868-T**4/113065000);
 const M =norm(357.5291092+35999.0502909*T-0.0001536*T*T+T*T*T/24490000);
 const Mp=norm(134.9633964+477198.8675055*T+0.0087414*T*T+T*T*T/69699-T**4/14712000);
 const F =norm(93.2720950+483202.0175233*T-0.0036539*T*T-T*T*T/3526000+T**4/863310000);
 const A1=norm(119.75+131.849*T), A2=norm(53.09+479264.290*T);
 const E=1-0.002516*T-0.0000074*T*T;
 let s=0;
 for(const[d,m,mp,f,c]of MT){let e=1; if(Math.abs(m)===1)e=E; if(Math.abs(m)===2)e=E*E;
  s+=c*e*sin(d*Dd+m*M+mp*Mp+f*F);}
 s+=3958*sin(A1)+1962*sin(Lp-F)+318*sin(A2);
 return norm(Lp+s/1e6);}
const rahu=J=>{const T=Tc(J);return norm(125.04452-1934.136261*T+0.0020708*T*T+T*T*T/450000)};

/* ---------- planets: JPL approximate Keplerian elements ---------- */
const EL={ // a,e,I,L,peri,node  then rates/century
 Mercury:[[0.38709927,0.20563593,7.00497902,252.25032350,77.45779628,48.33076593],
          [0.00000037,0.00001906,-0.00594749,149472.67411175,0.16047689,-0.12534081]],
 Venus:  [[0.72333566,0.00677672,3.39467605,181.97909950,131.60246718,76.67984255],
          [0.00000390,-0.00004107,-0.00078890,58517.81538729,0.00268329,-0.27769418]],
 Earth:  [[1.00000261,0.01671123,-0.00001531,100.46457166,102.93768193,0.0],
          [0.00000562,-0.00004392,-0.01294668,35999.37244981,0.32327364,0.0]],
 Mars:   [[1.52371034,0.09339410,1.84969142,-4.55343205,-23.94362959,49.55953891],
          [0.00001847,0.00007882,-0.00813131,19140.30268499,0.44441088,-0.29257343]],
 Jupiter:[[5.20288700,0.04838624,1.30439695,34.39644051,14.72847983,100.47390909],
          [-0.00011607,-0.00013253,-0.00183714,3034.74612775,0.21252668,0.20469106]],
 Saturn: [[9.53667594,0.05386179,2.48599187,49.95424423,92.59887831,113.66242448],
          [-0.00125060,-0.00050991,0.00193609,1222.49362201,-0.41897216,-0.28867794]]};
function helio(name,T){const[b,r]=EL[name];
 const a=b[0]+r[0]*T, e=b[1]+r[1]*T, I=b[2]+r[2]*T;
 const L=b[3]+r[3]*T, wb=b[4]+r[4]*T, O=b[5]+r[5]*T;
 const w=wb-O; let M=norm(L-wb); if(M>180)M-=360;
 let E=M+e*R*sin(M);
 for(let i=0;i<12;i++){const dM=M-(E-e*R*sin(E)); E+=dM/(1-e*cos(E));}
 const xp=a*(cos(E)-e), yp=a*Math.sqrt(1-e*e)*sin(E);
 return[ (cos(w)*cos(O)-sin(w)*sin(O)*cos(I))*xp+(-sin(w)*cos(O)-cos(w)*sin(O)*cos(I))*yp,
         (cos(w)*sin(O)+sin(w)*cos(O)*cos(I))*xp+(-sin(w)*sin(O)+cos(w)*cos(O)*cos(I))*yp,
         (sin(w)*sin(I))*xp+(cos(w)*sin(I))*yp ];}
function planetLon(name,J){const T=Tc(J);
 const p=helio(name,T), e=helio('Earth',T);
 const x=p[0]-e[0], y=p[1]-e[1];
 return norm(Math.atan2(y,x)*R + 1.39697*T);}   // J2000 -> ecliptic of date

/* ---------- ascendant ---------- */
const gmst=J=>{const T=Tc(J);return norm(280.46061837+360.98564736629*(J-2451545)+0.000387933*T*T-T*T*T/38710000)};
const obl=J=>23.439291-0.0130042*Tc(J);
function ascend(J,lat,lon){const e=obl(J), r=norm(gmst(J)+lon);
 return norm(Math.atan2(cos(r), -(sin(r)*cos(e)+tan(lat)*sin(e)))*R);}
function mc(J,lon){const e=obl(J), r=norm(gmst(J)+lon);
 return norm(Math.atan2(sin(r),cos(r)*cos(e))*R);}

/* ---------- formatting ---------- */
const NAK=["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","P.Phalguni","U.Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","P.Ashadha","U.Ashadha","Shravana","Dhanishtha","Shatabhisha","P.Bhadrapada","U.Bhadrapada","Revati"];
const SG=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const LORD=["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const YRS={Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17};
function fmt(l){const s=Math.floor(l/30), d=l-30*s, dg=Math.floor(d), mn=Math.round((d-dg)*60);
 const i=Math.floor(l/(360/27)), pd=Math.floor((l%(360/27))/(360/108))+1;
 return `${String(dg).padStart(2)}°${String(mn).padStart(2,'0')}' ${SG[s].padEnd(11)} ${NAK[i].padEnd(13)} p${pd}`;}
module.exports={jd,ayan,sunLon,moonLon,rahu,planetLon,ascend,mc,fmt,NAK,SG,LORD,YRS,norm};
