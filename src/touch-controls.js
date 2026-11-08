/* One-finger scene interaction. Pure state machine, independent of browser events. */
(function(){'use strict';
function facing(dx,dy,previous){if(Math.abs(dx)+Math.abs(dy)<.001)return previous===undefined?7:previous;return (Math.round(Math.atan2(dy,dx)/(Math.PI/4))+8)%8;}
function create(o){
 var p=null,threshold=o.threshold===undefined?220:o.threshold,dragThreshold=o.dragThreshold||10;
 function cancel(){if(!p)return;var charged=p.charged;p=null;if(o.cancel)o.cancel(charged);}
 function distance(){var dx=p.x-p.startX,dy=p.y-p.startY;return Math.sqrt(dx*dx+dy*dy);}
 function tick(now){
  if(!p)return;
  var age=Math.max(0,now-p.time),travel=distance(),range=Math.max(dragThreshold,o.dragDistance?o.dragDistance():150);if(!p.dragging&&travel>=dragThreshold){p.dragging=true;p.dragBase=Math.max(0,(p.power||0)-travel/range);}
  if(!p.charged&&(age>=threshold||travel>=dragThreshold)){
   p.charged=true;
   if(o.start&&o.start()===false){cancel();return;}
  }
  if(p&&p.charged&&o.hold){
   var held=Math.max(0,(age-threshold)/(o.chargeMs||900));
   var power=Math.min(1,p.dragging?p.dragBase+travel/range:held);
   if(p.power!==power){p.power=power;o.hold(power);}
  }
 }
 function move(point){
  if(!p||point.id!==p.id)return false;
  p.x=point.x;p.y=point.y;
  if(o.aim)o.aim(point);
  tick(point.time);
  return true;
 }
 return {
  down:function(point){if(p){cancel();return false;}p={id:point.id,startX:point.x,startY:point.y,x:point.x,y:point.y,time:point.time,charged:false};if(o.aim)o.aim(point);return true;},
  move:move,tick:tick,
  up:function(point){if(!p||point.id!==p.id)return false;move(point);if(!p)return false;var charged=p.charged;p=null;if(charged){if(o.release)o.release();}else if(o.tap)o.tap(point);return true;},
  cancel:cancel,active:function(){return !!p;},charged:function(){return !!p&&p.charged;}
 };
}
window.ReedTouch={facing:facing,create:create};
})();

;
