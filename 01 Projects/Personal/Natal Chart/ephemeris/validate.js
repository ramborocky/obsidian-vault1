const E=require('./ephemeris.js');
const {jd,ayan,sunLon,moonLon,norm}=E;
console.log("=== VALIDATION ===");
// 1. Shravana must END (sidereal Moon = 293°20') at 22:18 EAT 26 Aug 2026 = 19:18 UT
let J=jd(2026,8,26,19+18/60);
let sid=norm(moonLon(J)-ayan(J));
console.log(`Moon sidereal @ 22:18 EAT 26 Aug 26 : ${sid.toFixed(3)}°   (Shravana ends at 293.333°)  err ${(sid-293.3333).toFixed(3)}°`);
// 2. Dhanishtha must END (306°40') at 23:45 EAT 27 Aug = 20:45 UT
J=jd(2026,8,27,20+45/60); sid=norm(moonLon(J)-ayan(J));
console.log(`Moon sidereal @ 23:45 EAT 27 Aug 26 : ${sid.toFixed(3)}°   (Dhanishtha ends 306.667°)  err ${(sid-306.6667).toFixed(3)}°`);
// 3. Full moon 28 Aug 2026 04:18 UT -> elongation 180
J=jd(2026,8,28,4+18/60);
console.log(`Sun-Moon elongation @ stated full moon : ${norm(moonLon(J)-sunLon(J)).toFixed(3)}°  (want 180)`);
// 4. New moon / solar eclipse 12 Aug 2026 ~17:46 UT -> elongation 0
J=jd(2026,8,12,17+46/60);
console.log(`Sun-Moon elongation @ stated new moon  : ${norm(moonLon(J)-sunLon(J)).toFixed(3)}°  (want 0/360)`);
// 5. Tithi Chaturdashi must END (elong 168°) 06:38 EAT 27 Aug = 03:38 UT
J=jd(2026,8,27,3+38/60);
console.log(`Elongation @ Purnima onset 06:38 EAT   : ${norm(moonLon(J)-sunLon(J)).toFixed(3)}°  (want 168)`);
