/* Calendar / eligibility is shared by fish rolls, the guide, and trap harvests. */
(function(){'use strict';
var seasons=['春','夏','秋','冬'];
function date(s){return {season:Math.floor((s.day-1)/28)%4,day:(s.day-1)%28+1,year:Math.floor((s.day-1)/112)+1};}
function family(s){return s.familyUntil>0&&s.day<=s.familyUntil;}
function weather(s,p){return window.ReedDay.weather(s,p);}
function nightOpen(s){var d=date(s);return d.season===3&&d.day>=15&&d.day<=17&&s.minutes>=1020&&s.minutes<1560;}
function level(s){return window.ReedEquipment.level(s);}
function reasons(f,s,pools,opts){opts=opts||{};var why=[],d=date(s),p=pools[s.pool],route=f.routes.filter(function(r){return r.pool===s.pool;})[0],method=opts.method||'rod';if(!route&&opts.magic&&s.pool===2&&f.category==='night')route={seasons:[0,1,2,3]};
if(f.category==='crab'&&method!=='crab')why.push('需使用蟹笼');if(f.category!=='crab'&&method==='crab')why.push('不是蟹笼产物');
if(!route)why.push('当前水域不出现');else if(!opts.magic&&route.seasons.indexOf(d.season)<0)why.push('当前不是出没季节');
if(s.pool===18&&!nightOpen(s))why.push('夜市仅冬15–17日17:00后开放');
if(!opts.magic&&s.pool!==18&&!f.times.some(function(t){return s.minutes>=t[0]&&s.minutes<t[1];}))why.push('当前不在出没时段');
var w=weather(s,p);if(!opts.magic&&f.weather==='rain'&&['rain','storm','green'].indexOf(w)<0)why.push('需要雨天');if(!opts.magic&&f.weather==='sun'&&['sun','snow','wind'].indexOf(w)<0)why.push('需要晴天');
if(level(s)<f.level)why.push('需要钓鱼Lv.'+f.level);
if(!opts.ignoreDistance&&f.minDepth!==undefined&&opts.depth!==undefined&&opts.depth<f.minDepth)why.push('需要离岸至少'+f.minDepth+'格');if(!opts.ignoreDistance&&opts.depth===undefined&&(opts.cast||0)<f.minCast)why.push('需要至少'+Math.round(f.minCast*100)+'%力度远投');
if(f.category==='legend'){if(s.book[f.id])why.push('本存档已捕获');if(family(s))why.push('大家族挑战期间由二代鱼王替代');}
if(f.category==='family'&&!family(s))why.push('需要开启大家族挑战');
return why;}
function available(f,s,pools,opts){return reasons(f,s,pools,opts).length===0;}
function seasonsFor(f,pool){var routes=pool===undefined?f.routes:f.routes.filter(function(r){return r.pool===pool;});var all=[];routes.forEach(function(r){r.seasons.forEach(function(n){if(all.indexOf(n)<0)all.push(n);});});all.sort();return all.length===4?'四季':all.map(function(i){return seasons[i];}).join(' / ');}
function timeText(f){return f.times.map(function(t){function clock(n){var h=Math.floor(n/60);return (h>=24?'次日':'')+('0'+(h%24)).slice(-2)+':'+('0'+n%60).slice(-2);}return t[0]===360&&t[1]===1560?'全天':clock(t[0])+'–'+clock(t[1]);}).join('、');}
window.ReedRules={level:level,date:date,family:family,weather:weather,nightOpen:nightOpen,reasons:reasons,available:available,seasonsFor:seasonsFor,timeText:timeText,seasons:seasons};
})();

;
