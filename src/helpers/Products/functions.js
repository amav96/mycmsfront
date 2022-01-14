
 var product = {

     getStatusProduct(){

         var status = [
             {text:'Todos', value: 'all'},
             {text:'Activos', value: 1},
             {text:'Pausados', value: 2},
         ]
       
         return status
     },

     showStatusProduct(value){

        var status;
        switch(value){
            case 1:
                status = 'Activo'
            break;
            case 2:
                status = 'Pausado'
            break;
        }
        
         return status
     }


 }


 export default product