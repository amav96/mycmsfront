<template>

    <div>
         <v-overlay v-if="overlay" color="white" >
            <v-progress-circular
              indeterminate
              size="64"
              color="info"
            ></v-progress-circular>
          </v-overlay>

         <v-card-title>
          ¿Estas seguro?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="error" @click="DialogSmallScreen.display = !DialogSmallScreen.display" >
              Volver
          </v-btn>
          <v-btn class="success" @click="remove()" >
            Eliminar
          </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import axiosInstance from '@/services/api/axiosInstance'
export default {
props:['DialogSmallScreen','category','token','snackbar','url'],
data(){
return {
    overlay : false
}
},
methods:{
    remove(){
        const url = this.url.deleteCategory
        axiosInstance.post(url,{
            token:this.token,
            id: this.category.id
        })
        .then(res => {
            if(!res.data.success) {
                const snackbar = {display:true,text:'Algo saliò mal',timeout:2500,color:'error'}
                this.$emit("setSnackbar",snackbar)
                this.overlay = false
                this.DialogSmallScreen.display = false
                return
            }

            const snackbar = {display:true,text:'Eliminado correctamente',timeout:2500,color:'success'}
            this.$emit("setSnackbar",snackbar)
            this.$emit("_getCategories")
            this.overlay = false
            this.DialogSmallScreen.display = false
            
        })
        .catch(err => {
            console.log(err)
        })
    }
},
}
</script>

<style>

</style>