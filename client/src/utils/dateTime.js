const TIME_ZONE = "Asia/Colombo";
const LOCALE = "en-LK";

function parseTimestamp(value) {
    if (!value) return null;

    const timestamp = String(value);
    const isoTimestamp = timestamp.includes("T")
        ? timestamp
        : timestamp.replace(" ", "T");
    const hasTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(isoTimestamp);

    return new Date(hasTimeZone ? isoTimestamp : `${isoTimestamp}Z`);
}

export function formatTimestampDate(value) {
    const date = parseTimestamp(value);

    if (!date) return "-";

    return date.toLocaleDateString(LOCALE, {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

export function formatTimestampTime(value) {
    const date = parseTimestamp(value);

    if (!date) return "-";

    return date.toLocaleTimeString(LOCALE, {
        timeZone: TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}

export function formatTimestamp(value) {
    const date = parseTimestamp(value);

    if (!date) return "-";

    return date.toLocaleString(LOCALE, {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}
