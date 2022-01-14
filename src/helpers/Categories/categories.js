import axios from 'axios'

async function categories(url,module){
    const getToken = localStorage.getItem('auth')
    var categories = false
    await axios.get(url,{
        params: {
          token:getToken,
          module:module
        }
      })
      .then(res => {
         if(res.data.error){
           categories = false
           return categories
         }
         
         categories = res
      })
      .catch(err => {
        console.log(err)
      })  

      return categories
}

export {categories}