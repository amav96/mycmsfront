
 var gender = {
     
    returnGenderFormat(getGender){
        var setGender = ''
        switch(getGender) {
            case 'm':
                setGender = 'Masculino'
                break;
            case 'f':
                setGender = 'Femenino'
                break;
        }
        
        return setGender
    },
    genders(){
        var genders = [
            {text:'Masculino', value:'m'},
            {text:'Femenino', value:'f'}
        ]
        return genders
    }
}

export default gender