/* One layout probe enables flex-gap; margin rules are the Chrome 61 baseline. */
(function(){'use strict';var flex=document.createElement('div');flex.style.position='absolute';flex.style.visibility='hidden';flex.style.display='flex';flex.style.flexDirection='column';flex.style.rowGap='1px';flex.appendChild(document.createElement('div'));flex.appendChild(document.createElement('div'));document.body.appendChild(flex);var supported=flex.scrollHeight===1;flex.parentNode.removeChild(flex);if(supported)document.documentElement.classList.add('supports-flex-gap');})();

;
