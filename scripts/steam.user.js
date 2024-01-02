// ==UserScript==
// @name          Steam - Search gameplay video
// @namespace     github.com/Birdie0/userscripts
// @version       1.0.0
// @description   Add 'Check on YouTube' button to game page on Steam to quickly search gameplay video on YouTube
// @author        Birdie0
//
// @homepageURL   https://github.com/Birdie0/userscripts
// @supportURL    https://github.com/Birdie0/userscripts/issues
// @updateURL     https://raw.githubusercontent.com/Birdie0/userscripts/master/scripts/steam.user.js
//
// @match         https://store.steampowered.com/app/*
//
// @grant         GM.openInTab
// ==/UserScript==

const button = document.createElement('button')
button.className = 'btnv6_blue_hoverfade btn_medium'
button.innerHTML = '<span>Check on YouTube</span>'
button.addEventListener('click', () => {
	const gameTitle = document.querySelector('#appHubAppName').textContent
	const query = new URLSearchParams({ search_query: `${gameTitle} gameplay` })
	const url = `https://www.youtube.com/results?${query}`
	GM.openInTab(url)
})

const parent = document.querySelector('.apphub_OtherSiteInfo')
parent.append(button)
