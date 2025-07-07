import { initLogger, log } from './modules/logger.js';
import { initPlayer, playSample, getCurrentSample } from './modules/player.js';
import { handleModule } from './modules/effects.js';
import { initNFC } from './modules/nfc.js';

function refreshPlayback() {
    const currentSample = getCurrentSample();
    if (currentSample) {
        playSample(currentSample);
        log("Playback refreshed with updated effects.");
    } else {
        log("No sample is currently loaded; skipping refresh.");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    initLogger();
    initPlayer();

    document.getElementById("startButton").addEventListener("click", async () => {
        await Tone.start();
        log("Tone.js AudioContext started.");
    });

    document.getElementById("playButton").addEventListener("click", () => {
        const selectedSample = document.getElementById("sampleSelect").value;
        playSample(selectedSample);
    });
    const startStopButton = document.getElementById("startStopButton");
    let isPlaying = false;

    document.getElementById("scanNFCButton").addEventListener("click", async () => {
        await initNFC((json) => {
            handleModule(json);
            refreshPlayback();
        });
    });
});
