/* Day loop: 10 game minutes / 7 real seconds; menus and single-player fights pause time. */
(function(){'use strict';
var MAX=270;function clamp(n,a,b){return Math.max(a,Math.min(b,n));}function date(s){return {season:Math.floor((s.day-1)/28)%4,day:(s.day-1)%28+1,year:Math.floor((s.day-1)/112)+1};}
function seed(n){n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;}
function weather(s,p){if(p&&p.indoor)return 'indoor';var d=date(s),tropical=p&&p.tropical;if(s.rainDay===s.day)return 'rain';if(d.day===1&&!tropical)return 'sun';if(d.year===1&&d.season===0&&d.day===3&&!tropical)return 'rain';if(d.season===1&&!tropical&&(d.day===13||d.day===26))return 'storm';var greenDays=[5,6,7,14,15,16,18,23],green=greenDays[Math.floor(seed((s.weatherSeed||71823)+d.year*8231)*greenDays.length)];if(d.season===1&&d.day===green&&!tropical)return 'green';var r=seed((s.weatherSeed||71823)*31+s.day*977),q=seed(s.day*199+(s.weatherSeed||71823));if(tropical)return r<.24?'rain':'sun';if(d.season===3)return r<.63?'snow':'sun';var rain=d.season===1 ? .12+d.day*.003:.183;if(r<rain)return d.season===1&&q<.85?'storm':'rain';if(r<rain+(d.season===2 ? .45:.2))return 'wind';return 'sun';}
function label(minutes){return minutes<420?'清晨':minutes<660?'上午':minutes<780?'正午':minutes<1020?'下午':minutes<1140?'傍晚':minutes<1380?'夜晚':'深夜';}
function energyCost(level){return Math.max(1,8-level*.1);}
function tick(s,dt){s.clockSeconds=(s.clockSeconds||0)+dt;var steps=Math.floor((s.clockSeconds+1e-8)/7);if(!steps)return {changed:false};s.clockSeconds=Math.max(0,s.clockSeconds-steps*7);s.minutes=Math.min(1560,s.minutes+steps*10);return {changed:true,passout:s.minutes>=1560,late:s.minutes>=1440};}
function next(s,forced){var endDay=s.day,late=s.minutes>1440,rate=forced ? .5:late?clamp(1-(s.minutes-1440)/240,.5,1):1,loss=forced?Math.min(1000,Math.floor(s.coins*.1)):0,lost=forced?(s.bag.length+s.legacyBag.length):0;s.coins-=loss;if(forced){s.bag=[];s.legacyBag=[];s.debris=[];}s.foodBuff={level:0,remaining:0};s.day++;s.minutes=360;s.clockSeconds=0;s.energy=Math.round((s.maxEnergy||MAX)*rate*10)/10;s.home=true;s.lastDaySummary={day:endDay,forced:!!forced,lostCoins:loss,lostFish:lost,energy:s.energy};return s.lastDaySummary;}
function untilSeason(s){var current=date(s),days=29-current.day;for(var i=0;i<days;i++){s.minutes=1200;next(s,false);}return days;}
window.ReedDay={date:date,weather:weather,label:label,tick:tick,next:next,untilSeason:untilSeason,energyCost:energyCost,maxEnergy:MAX};
})();

;
