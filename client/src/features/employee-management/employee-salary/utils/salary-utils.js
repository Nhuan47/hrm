export function numberWithCommas (x) {
    if (+x === 0) {
        return x;
    }
    // this function used to add comma to number
    // ex: 0123456789 -> 123,456,789
    // Remove leading zeros
    const cleanedNumber = x.toString().replace(/^0+/, '');

    // Add commas to the cleaned number
    return cleanedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
