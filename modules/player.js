import { log } from './logger.js';

let player;
export let effectChain = [];
export let effectMap = {};
let currentSampleUrl = null;

export function initPlayer() {
    log("Player initialized.");
}

export function playSample(url) {
    if (player) {
        player.stop();
        player.dispose();
    }

    currentSampleUrl = url; // Track the currently loaded sample

    player = new Tone.Player({
        url: url,
        autostart: true,
        loop: true // Enable looping immediately
    });

    let lastNode = player;
    for (let effect of effectChain) {
        lastNode.connect(effect);
        lastNode = effect;
    }
    lastNode.connect(Tone.Destination);

    log(`Playing sample (looping): ${url}`);
}

export function getCurrentSample() {
    return currentSampleUrl;
}
