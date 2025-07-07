import { initLogger, log } from './modules/logger.js';
import { initPlayer, playSample } from './modules/player.js';
import { handleModule } from './modules/effects.js';
import { initNFC } from './modules/nfc.js';

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

    document.getElementById("scanNFCButton").addEventListener("click", async () => {
        await initNFC(handleModule);
    });
});
