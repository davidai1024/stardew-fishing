/* Source-map fishing geometry. Every tile uses the original TMX window and full-map depth. */
(function(){'use strict';var T=32,COLS=30,ROWS=18;
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function map(id,which){return window.ReedNative.map(id,which);}
function spot(s){var m=map(s.pool,s.spot);return m.spots[clamp(s.spot||0,0,m.spots.length-1)];}
function isWater(m,x,y){return x>=0&&x<COLS&&y>=0&&y<ROWS&&!!m.cells[y*COLS+x];}
function landing(s,power,level){var m=map(s.pool,s.spot),stand=spot(s),aim=s.aim||stand.aim,dx=aim.x-stand.x,dy=aim.y-stand.y;if(!dx&&!dy){dx=1;dy=.5;}var norm=Math.max(Math.abs(dx),Math.abs(dy));dx/=norm;dy/=norm;var maximum=4+(level>=1?1:0)+(level>=4?1:0)+(level>=8?1:0)+(level>=15?1:0)-(Math.abs(dy)>Math.abs(dx)?1:0),range=Math.max(1,Math.round(clamp(power,0,1)*maximum)),tile=null;for(var distance=range;distance<=maximum;distance++){var x=Math.round(stand.x+dx*distance),y=Math.round(stand.y+dy*distance);if(isWater(m,x,y)){tile={x:x,y:y};break;}}if(!tile)for(var distance=range-1;distance>0;distance--){var x=Math.round(stand.x+dx*distance),y=Math.round(stand.y+dy*distance);if(isWater(m,x,y)){tile={x:x,y:y};break;}}if(!tile)return null;return {tile:tile,x:tile.x*T+T/2,y:tile.y*T+T/2,distance:Math.max(Math.abs(tile.x-stand.x),Math.abs(tile.y-stand.y)),maximum:maximum,depth:m.depth[tile.y*COLS+tile.x],region:window.ReedNative.region(m,tile.x,tile.y),spot:stand.label};}
function kingAllowed(f,s,land){if(!land)return false;if((f.id===51||f.id===56)&&s.pool===2)return (s.spot||0)===1;if((f.id===54||f.id===59)&&s.pool===1)return (s.spot||0)===1;if((f.id===52||f.id===57)&&s.pool===4)return (s.spot||0)===1;if(f.id===47)return s.pool===17&&land.region==='waterfall-basin';return true;}
var bubbleKey=null,bubbleValue=null;
function bubbles(s){var key=[s.home,s.pool,s.spot||0,s.day,Math.floor(s.minutes/90)].join(':');if(key!==bubbleKey){bubbleKey=key;bubbleValue=calculateBubbles(s);}return bubbleValue;}
function calculateBubbles(s){if(s.home||s.pool===18)return null;var slot=Math.floor(s.minutes/90),code=(s.day*31+s.pool*17+slot*7)%19;if(code>7)return null;var copy=Object.assign({},s,{spot:0,aim:null}),land=landing(copy,[.45,.7,1][code%3],10);if(!land)return null;var source=map(s.pool,0),current=map(s.pool,s.spot),x=land.tile.x+source.origin[0]-current.origin[0],y=land.tile.y+source.origin[1]-current.origin[1];if(!isWater(current,x,y))return null;return {x:x*T+T/2,y:y*T+T/2,tile:{x:x,y:y}};}
window.ReedWorld={tileSize:T,cols:COLS,rows:ROWS,map:map,spot:spot,landing:landing,bubbles:bubbles,kingAllowed:kingAllowed,isWater:isWater,draw:function(c,id,s,t,thumb){if(window.ReedArt)window.ReedNative.draw(c,id,s,t,thumb);},drawHome:function(c,s,t){if(window.ReedArt)window.ReedNative.drawHome(c,s,t);},drawForeground:function(c,id,s,t){if(window.ReedArt)window.ReedNative.foreground(c,id,s,t);}};
})();

;
