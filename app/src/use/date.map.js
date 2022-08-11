export function getDateView(date) {
    return new Date(date).toLocaleDateString()
}

export function getAlarmView(alarm) {
    return new Date(alarm).toLocaleString()
}
