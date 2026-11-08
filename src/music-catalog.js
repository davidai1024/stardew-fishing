/* Scene playlists are an adaptation for this fishing game; album order is preserved in the library. */
(function(){'use strict';var catalog=window.ReedMusic,tracks=catalog.tracks||[catalog],byId={};tracks.forEach(function(t){byId[t.id]=t;});
function ids(numbers){return numbers.map(function(n){return 't'+('00'+n).slice(-3);}).filter(function(id){return !!byId[id];});}
function group(t){var n=t.number;return n>=5&&n<=7?'春季':n>=13&&n<=15?'夏季':n>=20&&n<=22?'秋季':n>=27&&n<=29?'冬季':n>=63&&n<=73||n>=92&&n<=99||[8,12,23,32,33,34,36,77,78].indexOf(n)>=0?'场景':n>=37&&n<=62?'人物':'活动与其他';}
function route(scene){var s=scene||{},p=s.pool||0,season=s.season||0,night=s.minutes>=1140,wet=['rain','storm','green'].indexOf(s.weather)>=0,key,numbers,label;
if(s.view==='shop'){key='shop';numbers=[32];label='渔具小店';}
else if(s.home){key='home';numbers=[78,59,4,2];label='河畔小屋';}
else if(p===18){key='submarine';numbers=[34,33];label='夜市潜艇';}
else if(p===9){key='desert';numbers=[36];label='沙漠绿洲';}
else if(p===15){key='pirate';numbers=[98];label='海盗湾';}
else if(p===16){key='volcano';numbers=[94,95,96];label='火山';}
else if(p===13||p===14){key='island';numbers=[92,93];label='姜岛';}
else if(p===6){key='mine20';numbers=[63,64,65];label='矿井浅层';}
else if(p===7){key='mine60';numbers=[66,67,68];label='冰晶矿井';}
else if(p===8){key='mine100';numbers=[69,70,71,72];label='熔岩矿井';}
else if(p===5){key='woods';numbers=[73];label='秘密森林';}
else if(p===10||p===11||p===12){key='mystic';numbers=[12,58,73];label='幽静水域';}
else if(wet){key='rain';numbers=[42,46,2];label='雨中垂钓';}
else if(night){key=p===2?'ocean-night':'night';numbers=p===2?[19,33,43]:[43,2,78];label=p===2?'夜晚海边':'夜色';}
else {key='season'+season;numbers=[[5,6,7],[13,14,15],[20,21,22],[27,28,29]][season]||[5,6,7];label=['春日','夏日','秋日','冬日'][season]+'水边';}
var found=ids(numbers);if(!found.length)found=[key.indexOf('mine')===0?'t063':key==='mystic'?'t073':key==='ocean-night'?'t033':'t002'];return {key:key,ids:found,label:label,day:s.day||1};}
var aliases={"t001":"t002","t002":"t002","t003":"t002","t004":"t002","t005":"t005","t006":"t005","t007":"t005","t008":"t002","t009":"t002","t010":"t002","t011":"t002","t012":"t002","t013":"t013","t014":"t013","t015":"t013","t016":"t002","t017":"t002","t018":"t002","t019":"t002","t020":"t020","t021":"t020","t022":"t020","t023":"t002","t024":"t002","t025":"t002","t026":"t002","t027":"t027","t028":"t027","t029":"t027","t030":"t002","t031":"t002","t032":"t002","t033":"t002","t034":"t002","t035":"t002","t036":"t002","t037":"t002","t038":"t002","t039":"t002","t040":"t002","t041":"t002","t042":"t002","t043":"t002","t044":"t002","t045":"t002","t046":"t002","t047":"t002","t048":"t002","t049":"t002","t050":"t002","t051":"t002","t052":"t002","t053":"t002","t054":"t002","t055":"t002","t056":"t002","t057":"t002","t058":"t002","t059":"t002","t060":"t002","t061":"t002","t062":"t002","t063":"t063","t064":"t063","t065":"t063","t066":"t063","t067":"t063","t068":"t063","t069":"t063","t070":"t063","t071":"t063","t072":"t063","t073":"t002","t074":"t002","t075":"t002","t076":"t002","t077":"t002","t078":"t002","t079":"t002","t080":"t002","t081":"t002","t082":"t002","t083":"t002","t084":"t002","t085":"t002","t086":"t002","t087":"t002","t088":"t002","t089":"t002","t090":"t002","t091":"t002","t092":"t002","t093":"t002","t094":"t094","t095":"t094","t096":"t094","t097":"t002","t098":"t002","t099":"t002","t100":"t002"};window.ReedMusicCatalog={compact:true,fallbackId:function(id){return aliases[id]||"t005";},tracks:tracks,byId:byId,group:group,route:route};
})();

;
