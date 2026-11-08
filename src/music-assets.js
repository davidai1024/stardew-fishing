/* Local script assets are allowed by the container; keep only two audio strings cached. */
(function(){'use strict';var cache={},order=[],pending={};
function remember(id,uri){cache[id]=uri;var index=order.indexOf(id);if(index>=0)order.splice(index,1);order.push(id);while(order.length>2)delete cache[order.shift()];}
function cleanup(job){clearTimeout(job.timer);if(job.script&&job.script.parentNode)job.script.parentNode.removeChild(job.script);}
function fail(id,message){var job=pending[id];if(!job)return;job.done=true;delete pending[id];cleanup(job);job.reject(new Error(message));}
function register(id,uri){if(typeof uri!=='string'||uri.indexOf('data:audio/mp4;base64,')!==0)return;remember(id,uri);var job=pending[id];if(job){job.done=true;delete pending[id];cleanup(job);job.resolve(uri);}}
function load(track){if(cache[track.id]){remember(track.id,cache[track.id]);return Promise.resolve(cache[track.id]);}if(pending[track.id])return pending[track.id].promise;var job={done:false};job.promise=new Promise(function(resolve,reject){job.resolve=resolve;job.reject=reject;});pending[track.id]=job;try{var script=document.createElement('script');job.script=script;script.src=track.src;script.async=true;script.onerror=function(){if(!job.done)fail(track.id,'MUSIC_ASSET_FAILED');};script.onload=function(){if(!job.done)fail(track.id,'MUSIC_ASSET_INVALID');};job.timer=setTimeout(function(){fail(track.id,'MUSIC_ASSET_TIMEOUT');},30000);document.head.appendChild(script);}catch(e){fail(track.id,'MUSIC_ASSET_UNAVAILABLE');}return job.promise;}
window.ReedMusicAssets={load:load,register:register,cancel:function(id){fail(id,'MUSIC_ASSET_CANCELLED');}};
})();

;
