function randomSelect(arr, n) {
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
    if (diffInYear > 0) {
        return `${year}-${month.toString()} ${day.toString()}`;
    }
    if (diffInDay > 0) {
        return `${month.toString()} ${day.toString()} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export { randomSelect, timeDifference };