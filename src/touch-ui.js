/* touch-ui.js: keep native selection/callouts for editable fields only. */
(function () {
'use strict';
function preventGameSelection(e) {
 var target=e.target;
 if(target&&target.nodeType!==1)target=target.parentElement;
 if(!target||!target.closest)return;
 if(target.isContentEditable||target.closest('input,textarea,select'))return;
 if(target.closest('#app,#welcome,.overlay,#toast')&&e.cancelable)e.preventDefault();
}
['selectstart','contextmenu','dragstart'].forEach(function(type){
 document.addEventListener(type,preventGameSelection,true);
});
// Pointer-event cancellation alone does not cancel every WebView zoom gesture.
// Cancel native touches on gameplay surfaces, leaving click-based controls alone.
function preventZoom(e){if(e.cancelable)e.preventDefault();}
function preventGameplayTouch(e){
 var target=e.target;
 if(target&&target.nodeType!==1)target=target.parentElement;
 if(!target||!target.closest)return;
 var control=target.closest('button,a,input,textarea,select,[contenteditable]');
 if(control&&control.id!=='reel-btn')return;
 preventZoom(e);
}
Array.prototype.forEach.call(document.querySelectorAll('#world,#game-overlay'),function(surface){
 ['touchstart','touchmove','touchend'].forEach(function(type){
  surface.addEventListener(type,preventGameplayTouch,{passive:false});
 });
 ['gesturestart','gesturechange','gestureend','dblclick'].forEach(function(type){
  surface.addEventListener(type,preventZoom,{passive:false});
 });
});
})();

