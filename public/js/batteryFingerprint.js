export async function getBatteryFingerprint() {
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        return {
            level: battery.level,
            charging: battery.charging
        };
    }
    return 'Battery API not supported';
}

