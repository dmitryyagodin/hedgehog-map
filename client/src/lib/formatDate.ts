export function formatDate(date: Date | number, locale = 'fi', options?: Intl.DateTimeFormatOptions): string {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return new Intl.DateTimeFormat(locale, mergedOptions).format(date);
}
