import { initLogger, log } from './modules/logger.js';
import { initPlayer, playSample, stopSample, getCurrentSample } from './modules/player.js';
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

    const startStopButton = document.getElementById("startStopButton");
    let isPlaying = false;

    startStopButton.addEventListener("click", () => {
        const selectedSample = document.getElementById("sampleSelect").value;
        if (!isPlaying) {
            playSample(selectedSample);
            log("Sample started.");
            startStopButton.textContent = "Stop Sample";
            isPlaying = true;
        } else {
            stopSample();
            log("Sample stopped.");
            startStopButton.textContent = "Start Sample";
            isPlaying = false;
        }
    });

    document.getElementById("scanNFCButton").addEventListener("click", async () => {
        await initNFC((json) => {
            handleModule(json);
            refreshPlayback();
        });
    });
});
