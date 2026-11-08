/* Independently implemented fishing model. Documented constants: Stardew Valley Wiki / Fishing.
   Five movement families approximate the documented behaviours; they are not original game code. */
(function(){'use strict';
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function random(r,a,b){return a+(b-a)*r();}
function barSize(level,cork,deluxe){return clamp((96+8*level+((typeof cork==='number'?cork:cork?1:0)*24)+(deluxe?12:0))/568,.12,.6);}
function wait(o,r){r=r||Math.random;var maximum=Math.max(.6,30-o.level*.25-(o.spinnerSeconds!==undefined?o.spinnerSeconds:o.spinner===1?3.75:o.spinner===2?7.5:0));var seconds=random(r,.6,maximum)*(o.first===false?1:.75);if(o.bait==='lucky')seconds*=.33;else if(o.bait==='wild'||o.bait==='challenge')seconds*=.375;else if(o.bait&&o.bait!=='none')seconds*=.5;if(o.bubbles)seconds*=.25;return Math.max(.5,seconds);}
function water(pool){var max=[2,5,5,5,5,3,5,5,5,2,5,4,4,5,5,5,5,5,5][pool];return {maxDepth:max||3};}
function depth(pool,power){return Math.max(0,Math.min(5,Math.floor(power*(water(pool).maxDepth+1))));}
function bubbles(s){return window.ReedWorld?window.ReedWorld.bubbles(s):null;}
function inBubbles(s,power){if(!window.ReedWorld)return false;var b=bubbles(s),land=window.ReedWorld.landing(s,power,window.ReedRules.level(s));return !!b&&!!land&&Math.max(Math.abs(b.tile.x-land.tile.x),Math.abs(b.tile.y-land.tile.y))<=1;}

/* Numerical reference units: 568px bar track, 548px fish travel, 60 ticks/sec.
   Equations are implemented here as a small state model; no original source is bundled. */
var TRACK=568,FISH_LIMIT=532;
function integer(r,a,b){return a+Math.floor(r()*(b-a));}
function fishStep(g,r){
 if(g.kingTrial){var t=g.time;if(t<2.8)g.y=.84+.035*Math.sin(t*2);else if(t<4.2)g.y=.84-.6*(1-Math.cos((t-2.8)/1.4*Math.PI))/2;else if(t<6.8)g.y=.24+.5*(t-4.2)/2.6;else g.y=.61+.2*Math.sin((t-6.8)*1.4)+.04*Math.sin(t*3);g.target=g.y;return;}
 var f=g.fish,d=f.difficulty,m=f.motion,body=g.motionState;if(!body){body=g.motionState={position:clamp(g.y*TRACK-16,0,FISH_LIMIT),speed:0,target:-1,drift:0};}var retarget=d*(m==='smooth'?20:1)/4000;
if((m!=='smooth'||body.target<0)&&r()<retarget){var reach=Math.min(99,d+integer(r,10,45))/100;body.target=body.position+integer(r,-Math.floor(body.position),Math.max(1,Math.floor(548-body.position)))*reach;}
if(m==='floater')body.drift=Math.max(-1.5,body.drift-.01);if(m==='sinker')body.drift=Math.min(1.5,body.drift+.01);
if(body.target>=0&&Math.abs(body.target-body.position)>3){var wanted=(body.target-body.position)/(integer(r,10,30)+100-Math.min(100,d));body.speed+=(wanted-body.speed)*.2;}else if(m!=='smooth'&&r()<d/2000){body.target=body.position+(r()<.5?-integer(r,51,101):integer(r,50,101));}else body.target=-1;
if(m==='dart'&&r()<d/1000){var sign=r()<.5?-1:1;body.target=body.position+sign*integer(r,50,101+2*d);}body.target=clamp(body.target,-1,548);body.position=clamp(body.position+body.speed+body.drift,0,FISH_LIMIT);g.y=(body.position+16)/TRACK;g.target=body.target<0?g.y:(body.target+16)/TRACK;g.fishVelocity=body.speed*60/TRACK;}
function inside(g){var center=g.y*TRACK,top=g.bar*TRACK,bottom=(g.bar+g.size)*TRACK;return center-14>=top&&center+14<=bottom||(g.bar>=1-g.size-.007&&center>=548-g.size*TRACK);}
function barStep(g,held,o){var onFish=inside(g),v=(g.velocity||0)*TRACK/60,pos=g.bar*TRACK,size=g.size*TRACK,force=(held?-.25:.25)*(onFish?(o.barbed ? .3:.6):1);if(held&&(pos<=0||pos>=TRACK-size))v=0;if(o.barbed&&onFish)v+=(g.y*TRACK<pos+size/2?-.2:.2)*Number(o.barbed);v+=force;pos+=v;if(pos+size>TRACK){pos=TRACK-size;v=-Math.abs(v)*2/3*(o.lead ? Math.pow(.1,Number(o.lead)):1);}if(pos<0){pos=0;v=Math.abs(v)*2/3;}g.bar=pos/TRACK;g.velocity=v*60/TRACK;}
function movement(g,dt,r){g.motionRemainder=(g.motionRemainder||0)+dt*60;while(g.motionRemainder>=1-1e-9){fishStep(g,r||Math.random);g.motionRemainder-=1;}}
function bar(g,held,dt,o){g.barRemainder=(g.barRemainder||0)+dt*60;while(g.barRemainder>=1-1e-9){barStep(g,held,o||{});g.barRemainder-=1;}}
function step(g,held,dt,o,r){o=o||{};r=r||Math.random;g.fixedRemainder=(g.fixedRemainder||0)+dt;while(g.fixedRemainder>=1/60-1e-9&&g.progress>0&&g.progress<1){g.fixedRemainder-=1/60;g.time+=1/60;fishStep(g,r);barStep(g,held,o);var tracked=inside(g),collecting=!!g.treasure&&!g.treasureWon&&g.time>=(g.treasureDelay||0)&&g.treasureY>=g.bar&&g.treasureY<=g.bar+g.size;g.inside=tracked;if(o.challenge&&g.lastInside!==false&&!tracked){g.escapes=(g.escapes||0)+1;if(g.escapes>=3)g.progress=0;}g.lastInside=tracked;if(tracked&&g.progress>0)g.progress+=.002;else if(!(collecting&&o.treasureHunter)){if(!g.tutorial)g.progress-=o.trap>=2? .0015:o.trap? .002:.003;g.out+=1/60;}if(g.treasure&&!g.treasureWon&&g.time>=(g.treasureDelay||0)&&g.treasureY>=g.bar&&g.treasureY<=g.bar+g.size){g.treasureProgress+=1/72;if(g.treasureProgress>=1){g.treasureWon=true;}}}return inside(g);}
function quality(level,depthValue,out,perfect,r){r=r||Math.random;var even=level-level%2;if(even<10)even+=2*Math.floor(r()*((10-even)/2+1));var factor=clamp(depthValue/5*(even+2)/10*random(r,.9,1.1),0,1),q=factor>=.66?'gold':factor>=.33?'silver':'normal';if(perfect&&q==='gold')q='iridium';else if(perfect&&q==='silver')q='gold';return {quality:q,factor:factor};}
window.ReedMechanics={wait:wait,barSize:barSize,water:water,depth:depth,bubbles:bubbles,inBubbles:inBubbles,movement:movement,bar:bar,step:step,inside:inside,quality:quality};
})();

;
