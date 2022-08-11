export function debounced(delay) {
    let timer

    const debouncedCallback = (callBack) => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(callBack, delay)
    }

    return debouncedCallback
}
