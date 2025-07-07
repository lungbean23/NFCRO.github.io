import { effectChain, effectMap } from './player.js';
import { log } from './logger.js';

export function handleModule(json) {
    if (!json || typeof json !== "object") {
        log("No valid JSON data on NFC tag, passing through without change.");
        return;
    }

    if (json.action === "add") {
        const moduleName = json.module;
        if (!moduleName) {
            log("No module specified in JSON, passing through.");
            return;
        }

        if (effectMap[moduleName]) {
            // Toggle OFF
            const effect = effectMap[moduleName];
            effect.dispose();
            delete effectMap[moduleName];
            const index = effectChain.indexOf(effect);
            if (index > -1) {
                effectChain.splice(index, 1);
            }
            log(`${moduleName} removed (toggle OFF).`);
        } else {
            // Toggle ON
            let effect;
            if (moduleName === "reverb") {
                effect = new Tone.Reverb(json.decay || 1.5).toDestination();
                effect.wet.value = json.wet || 0.5;
                log(`Reverb added: decay=${json.decay || 1.5}, wet=${json.wet || 0.5}`);
            }
            else if (moduleName === "filter") {
                effect = new Tone.Filter(json.frequency || 800, json.type || "lowpass").toDestination();
                log(`Filter added: freq=${json.frequency || 800}, type=${json.type || "lowpass"}`);
            }
            else if (moduleName === "delay") {
                effect = new Tone.FeedbackDelay(json.delayTime || "8n", json.feedback || 0.5).toDestination();
                log(`Delay added: delayTime=${json.delayTime || "8n"}, feedback=${json.feedback || 0.5}`);
            }
            else if (moduleName === "distortion") {
                effect = new Tone.Distortion(json.amount || 0.4).toDestination();
                log(`Distortion added: amount=${json.amount || 0.4}`);
            }
            else {
                log(`Unknown module: ${moduleName}. Passing through without change.`);
                return;
            }
            effectMap[moduleName] = effect;
            effectChain.push(effect);
        }
    }
    else if (json.action === "clear") {
        effectChain.forEach(effect => effect.dispose());
        effectChain.length = 0;
        Object.keys(effectMap).forEach(key => delete effectMap[key]);
        log("Effect chain cleared.");
    }
    else {
        log(`Unknown or missing action: ${json.action}. Passing through without change.`);
    }
}
