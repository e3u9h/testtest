function randomSelect(arr, n) {
    let result = new Array(n),
        len = arr.length
    if (n > len)
        n = len
    let taken = new Array(len);
    for (let i = n; i > 0; i--) {
        let x = Math.floor(Math.random() * len);
        result[i] = arr[x in taken ? taken[x] : x];
        taken[x] = len in taken ? taken[len] : len;
        len--
    }
    return result;
}

function timeDifference(time) {
    const now = new Date();
    const postTime = new Date(time);
    console.log(time + postTime);
    const year = postTime.getFullYear();
    const month = postTime.getMonth() + 1;
    const day = postTime.getDate();
    const hours = postTime.getHours();
    const minutes = postTime.getMinutes();
    const diffInDay = now.getDate() - day;
    const diffInYear = now.getFullYear() - year;
    if (diffInYear > 0) {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    if (diffInDay > 0) {
        return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
export { randomSelect, timeDifference };