export function initLogger() {
    log("Logger initialized.");
}

export function log(msg) {
    const status = document.getElementById("status");
    status.textContent += `\n${msg}`;
    status.scrollTop = status.scrollHeight;
}
