/* Public Xiaohongshu container APIs only. Chrome 61 / ES2017 baseline. */
(function () {
'use strict';
var version = 0, nativeStorage = false, KEY = 'reedbay_save_v4', OLD_KEY = 'reedbay_save_v3', PREVIOUS_KEY = 'reedbay_save_v2', LEGACY_KEY = 'reedbay_save_v1';
function api(){return window.xhs && window.xhs.miniTool;}
function call(name, options){return new Promise(function(resolve,reject){var m=api(),done=false;var timeout=setTimeout(function(){if(!done){done=true;reject(new Error('API_TIMEOUT'));}},1800);function finish(ok,value){if(done)return;done=true;clearTimeout(timeout);if(ok)resolve(value);else reject(value || new Error('API_FAILED'));}try{if(!m || typeof m[name]!=='function')throw new Error('API_UNAVAILABLE');var result=m[name](options || {});Promise.resolve(result).then(function(r){if(r===undefined)finish(false,new Error('API_EMPTY'));else finish(true,r);},function(e){finish(false,e);});}catch(e){finish(false,e);}});}
function build(v){var n=Number(v && v.miniToolEnv && v.miniToolEnv.buildVersion);return isFinite(n) && n>0 ? Math.floor(n/1000) : 0;}
function init(){version=build(window.xhs && window.xhs.launchOptions);var p=version?Promise.resolve():call('getLaunchOptions').then(function(r){version=build(r);}).catch(function(){});return p.then(function(){var m=api();nativeStorage=version>=9460 && !!m && typeof m.getStorage==='function' && typeof m.setStorage==='function';return {version:version,nativeStorage:nativeStorage};});}
function read(){var keys=[KEY,OLD_KEY,PREVIOUS_KEY,LEGACY_KEY];if(nativeStorage){function at(index){return call('getStorage',{key:keys[index]}).then(function(r){if(!r||!Object.prototype.hasOwnProperty.call(r,'data'))throw new Error('INVALID_STORAGE_RESPONSE');if(r.data!==null&&r.data!==undefined&&r.data!=='')return {data:r.data,source:'native',legacy:index>0};return index+1<keys.length?at(index+1):{data:null,source:'native',legacy:false};});}return at(0);}try{for(var i=0;i<keys.length;i++){var data=localStorage.getItem(keys[i]);if(data)return Promise.resolve({data:data,source:'browser',legacy:i>0});}return Promise.resolve({data:null,source:'browser',legacy:false});}catch(e){return Promise.reject(e);}}
function write(data){if(nativeStorage)return call('setStorage',{key:KEY,data:data}).then(function(){return true;});try{localStorage.setItem(KEY,data);return Promise.resolve(true);}catch(e){return Promise.reject(e);}}
function migrateCandidate(){try{return localStorage.getItem(KEY)||localStorage.getItem(OLD_KEY)||localStorage.getItem(PREVIOUS_KEY)||localStorage.getItem(LEGACY_KEY);}catch(e){return null;}}
function insets(info){function num(n){return typeof n==='number'&&isFinite(n)?n:0;}var h=num(info.windowHeight),w=num(info.windowWidth),safe=info.safeArea||{},top=Math.max(0,num(safe.top)),left=Math.max(0,num(safe.left)),right=w>0&&typeof safe.right==='number'?Math.max(0,w-safe.right):0,bottom=h>0&&typeof safe.bottom==='number'?Math.max(0,h-safe.bottom):0;var menus=info.menuButtons||{};['back','me','share'].forEach(function(k){var r=menus[k];if(r && num(r.bottom)>0 && num(r.top)<Math.max(140,h*.25))top=Math.max(top,num(r.bottom)+8);});return {top:Math.min(top,h>0?h*.35:160),bottom:Math.min(bottom,100),left:Math.min(left,100),right:Math.min(right,100)};}
function windowInfo(){if(version<9490)return Promise.resolve(null);return call('getWindowInfo').then(function(r){return insets(r);}).catch(function(){return null;});}
function vibrate(){if(version<9500)return;call('vibrateShort',{type:'light'}).catch(function(){});}
if(window.xhs)document.documentElement.style.setProperty('--safe-top','64px');
window.ReedPlatform={init:init,read:read,write:write,migrateCandidate:migrateCandidate,windowInfo:windowInfo,vibrate:vibrate,insets:insets,isNative:function(){return nativeStorage;}};
})();

;
