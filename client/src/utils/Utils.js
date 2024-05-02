function randomSelect(arr, n) {
    // This is a function that randomly selects min(n, arr.length) elements from an array,
    // which is modified from the Fisher-Yates shuffle algorithm
    let result = new Array(n),
        len = arr.length
    if (n > len)
        n = len
    let taken = new Array(len);
    for (let i = n - 1; i >= 0; i--) {
        let x = Math.floor(Math.random() * (len));
        result[i] = arr[x in taken ? taken[x] : x];
        taken[x] = len - 1 in taken ? taken[len - 1] : len - 1;
        len--
        // console.log("hereselect" + result + " " + taken + " " + len)
    }
    return result;
}

function timeDifference(time) {
    // This is a functionthat display the time of the post according to the
    // time difference between the post time and the current time
    const monthAbbreviations = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const now = new Date();
    const postTime = new Date(time);
    // console.log(time + postTime);
    const year = postTime.getFullYear();
    const month = monthAbbreviations[postTime.getMonth()];
    const day = postTime.getDate();
    const hours = postTime.getHours();
    const minutes = postTime.getMinutes();
    const diffInDay = now / 86400000 - postTime / 86400000;
    const diffInYear = now.getFullYear() - year;
    // If the post year is different from the current year, display "year month day"
    if (diffInYear > 0) {
        return `${year} ${month.toString()} ${day.toString()}`;
    }
    // If the post day is different from the current day, display "month day hour:minute"
    if (diffInDay > 0) {
        return `${month.toString()} ${day.toString()} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    // If the post day is the same as the current day, display "hour:minute"
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export { randomSelect, timeDifference };