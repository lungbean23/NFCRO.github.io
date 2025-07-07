import { log } from './logger.js';

export async function initNFC(callback) {
    if ("NDEFReader" in window) {
        try {
            const reader = new NDEFReader();
            await reader.scan();
            log("NFC scan started. Tap a tag...");

            reader.onreading = event => {
                const decoder = new TextDecoder();
                for (const record of event.message.records) {
                    const data = decoder.decode(record.data);
                    log(`NFC Tag Read: ${data}`);
                    try {
                        const json = JSON.parse(data);
                        callback(json);
                    } catch (e) {
                        log(`Error parsing JSON: ${e}. Passing through without change.`);
                    }
                }
            };

        } catch (error) {
            log(`NFC scan failed: ${error}`);
        }
    } else {
        log("Web NFC not supported in this browser.");
    }
}
