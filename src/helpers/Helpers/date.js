
 var date = {
     
    date(){
        var today = new Date();
        var date = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' +
            ("0" + today.getDate()).slice(-2);
        
        return date
    },
    dateTime(){
        var today = new Date();
        var getMin = today.getMinutes();
        var getSeconds = today.getSeconds()
        var getHours = today.getHours()
        if (getMin < 10) { getMin = '0' + today.getMinutes() }
        if (getSeconds < 10) { getSeconds = '0' + today.getSeconds() }
        if (getHours < 10) { getHours = '0' + today.getHours() }

        var dateTime = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' +
            ("0" + today.getDate()).slice(-2) + ' ' + getHours + ':' + getMin + ':' + getSeconds;

        return dateTime

    },
    dateOver16(){
        var today = new Date();
        var date = (today.getFullYear() - 16) + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' +
            ("0" + today.getDate()).slice(-2);
        
        return date
    },
    returnDateFormatEs(date){
        var dateFormatEs = date.split('-')
        dateFormatEs =  dateFormatEs[2]+'-'+dateFormatEs[1]+'-'+dateFormatEs[0]
        return dateFormatEs
    }
}

export default date