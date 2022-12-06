function formatDate(date){
    date = new Date(date)
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let formatedDate = (day < 10 ? `0${day}/` : String(day)+'/') + ((month + 1) < 10 ? `0${month+1}/` : String(month)+'/') + String(year)
    return formatedDate;
}

module.exports = {
    formatDate
}