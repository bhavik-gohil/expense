const formatters: Record<string, Intl.DateTimeFormat> = {};

function getFormatter(options: Intl.DateTimeFormatOptions) {
    const key = JSON.stringify(options);
    if (!formatters[key]) {
        formatters[key] = new Intl.DateTimeFormat(undefined, options);
    }
    return formatters[key];
}

export const formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return getFormatter(options).format(d);
};

export const formatFullMonth = (date: Date) => {
    return getFormatter({ month: 'long', year: 'numeric' }).format(date);
};

export const formatShortDate = (date: string | Date) => {
    return getFormatter({ weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(date));
};

export const formatTime = (date: string | Date | number) => {
    return getFormatter({ hour: '2-digit', minute: '2-digit' }).format(new Date(date));
};
