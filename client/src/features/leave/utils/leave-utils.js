export function getYears () {
    const currentYear = new Date().getFullYear();

    const range = (start, stop, step) =>
        Array.from(
            {
                length: (stop - start) / step + 1
            },
            (_, i) => start + i * step
        );
    const years = range(currentYear, 2016, -1);
    return years;
}

export function isFloat (n) {
    if (n.match(/^-?\d*(\.\d+)?$/) && !isNaN(parseFloat(n)) && n % 1 != 0)
        return true;
    return false;
}

export function formatTimeOffDate (dateString, adjustHours = 0) {
    // Extract the timestamp in milliseconds
    const timestamp = parseInt(dateString.match(/\d+/)[0], 10);

    const dateObject = new Date(timestamp);

    // Manually adjust the timezone offset to +07:00
    const offset = adjustHours * 60; // 7 hours in minutes
    const adjustedDate = new Date(dateObject.getTime() + offset * 60000);

    // Format the adjusted date as "2024-02-07T07:00:00Z"
    const formattedDate = adjustedDate.toISOString().slice(0, -5) + 'Z';

    return formattedDate;
}
