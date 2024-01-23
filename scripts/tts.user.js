// ==UserScript==
// @name         Selection to TTS
// @namespace    github.com/Birdie0/userscripts
// @version      1.0.2
// @description  Press C twice to read selected text with TTS
// @author       Birdie0
//
// @homepageURL  https://github.com/Birdie0/userscripts
// @homepage     https://github.com/Birdie0/userscripts
// @supportURL   https://github.com/Birdie0/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/Birdie0/userscripts/master/scripts/tts.user.js
// @downloadURL  https://raw.githubusercontent.com/Birdie0/userscripts/master/scripts/tts.user.js
//
// @match        *://*/*
// @noframes
//
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// ==/UserScript==

// speech config
GM.registerMenuCommand('config TTS Voice', async () => {
	// set voice pitch
	const ttsPitch = await GM.getValue('tts_pitch', 1)
	await GM.setValue(
		'tts_pitch',
		Number(window.prompt(join('set default voice pitch:', '[0 - 2] (default: 1)'), ttsPitch) || 1),
	)

	// voice speed
	const ttsRate = await GM.getValue('tts_rate', 1)
	await GM.setValue(
		'tts_rate',
		Number(window.prompt(join('set default voice rate:', '[0.1 - 10] (default: 1)'), ttsRate) || 1),
	)

	// voice volume
	const ttsVolume = await GM.getValue('tts_volume', 1)
	await GM.setValue(
		'tts_volume',
		Number(
			window.prompt(join('set default voice volume:', '[0 - 1] (default: 1)'), ttsVolume) || 1,
		),
	)

	// tts voice
	const voices = await getVoices()
	const voicesList = voices.map((voice) => `- ${voice.name}`).join('\n')
	console.log(voicesList)

	const ttsVoice = await GM.getValue('tts_voice', voices[0]?.name)
	await GM.setValue(
		'tts_voice',
		window.prompt(
			join(
				'set default voice:',
				'(check console if list got truncated)',
				'if list is blank, run this config command again)',
				voicesList,
			),
			ttsVoice,
		) || voices[0]?.name,
	)
})

// read text selection aloud
VM.shortcut.register('keyC keyC', async () => {
	const selection = document.getSelection()
	const text = selection?.toString()
	if (!text) return

	await speak(text)
})

async function speak(text) {
	const ssu = new SpeechSynthesisUtterance(text)

	ssu.pitch = await GM.getValue('tts_pitch', 1)
	ssu.rate = await GM.getValue('tts_rate', 1)
	ssu.volume = await GM.getValue('tts_volume', 1)
	ssu.voice = await selectVoice()

	window.speechSynthesis.cancel()
	window.speechSynthesis.speak(ssu)
}

async function selectVoice() {
	const ttsVoice = await GM.getValue('tts_voice')
	if (!ttsVoice) return

	const voice = (await getVoices()).find((voice) => voice.name == ttsVoice)
	return voice
}

// helper methods

function join(...str) {
	return str.join('\n')
}

async function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms))
}

async function getVoices(maxTries = 10) {
	let tries = 0
	let arr = window.speechSynthesis.getVoices()
	while (arr.length === 0) {
		if (tries === maxTries) break
		console.count()
		await sleep(500)
		arr = window.speechSynthesis.getVoices()
		++tries
	}
	return arr
}
