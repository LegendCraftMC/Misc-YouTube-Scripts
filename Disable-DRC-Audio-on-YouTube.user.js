// ==UserScript==
// @name         Disable DRC Audio on YouTube
// @author       LegendCraft (forked from Adri and The0x539)
// @namespace    Tampermonkey Scripts
// @match        https://www.youtube.com/*
// @grant        none
// @version      0.2
// @description  The script disables DRC audio (Stable Volume) on YouTube (which also works with loudness normalization disabled scripts).
// @license      MIT
// @run-at       document-idle
// ==/UserScript==
/* jshint esversion: 11 */

function waitForElement(selector) {
	return new Promise((resolve, reject) => {
		let element = document.querySelector(selector);
		if (element) {
			resolve(element);
			return;
		}

		const observer = new MutationObserver(mutations => {
			const element = document.querySelector(selector);
			if (element) {
				observer.disconnect();
				resolve(element);
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

async function disableDRC() {
	const menuButton = await waitForElement('.ytp-settings-button');

	menuButton.click();
	menuButton.click();

	const drcMenuItem = await waitForElement('.ytp-drc-menu-item:not([aria-disabled])');

	if (drcMenuItem.getAttribute('aria-checked') === 'true') {
		drcMenuItem.click();
		console.log('Disabled DRC Audio');
	} else {
		console.log('DRC Audio is already disabled');
	}
}

disableDRC().catch(error => console.error('Error:', error));

(function() {
let css = `
/* Remove the 'Stable volume' option from the menu */
.ytp-panel .ytp-menuitem.ytp-drc-menu-item {
display: none !important
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();