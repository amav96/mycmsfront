<template>
  <v-card-text  class=" pa-1 mt-4" >
        <v-overlay v-if="overlay" color="white" >
            <v-progress-circular
              indeterminate
              size="64"
              color="info"
            ></v-progress-circular>
          </v-overlay>
          <div >
              <v-row class="mx-1 d-flex justify-center align-items-center align-content-center  flex-column">
              <v-col cols="12" lg="4" xl="4" md="6" xs="6">
                  <v-text-field
                  label="Nombre"
                  v-model.trim="name"
                  required
                  color="dark"
                  ></v-text-field>
                  <CompleteSimple
                  :url="url.getModules"
                  title="Modulos"
                  :token="token"
                  :reassign="outModule"
                  ref="reassingData"
                  @exportVal="module = $event"
                  />
              </v-col>
              <v-col cols="12" lg="4" xl="4" md="6" xs="6">
                  <v-text-field
                  v-model.trim="icon"
                  label="Icono"
                  required
                  color="dark"
                  placeholder="mdi-plus"
                  :rules="validateIcon"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4" xl="4" md="6" xs="6">
                  <div class=" my-1 mt-4">
                  <v-btn 
                  class="py-6"
                  
                  block
                  color="info"
                  @click="active()"
                  :disabled="disabledUpdate || overlay"
                  >
                  Guardar
                  </v-btn>
              </div>
              </v-col>
              
              
              
            </v-row>
          </div>
          
          
    </v-card-text>
    
</template>

<script>
import CompleteSimple from '@/components/form/reusable/select/CompleteSimple'
import axiosInstance from '@/services/api/axiosInstance'
export default {
    components:{CompleteSimple},
    props:['DialogFullScreen','url','token','category','snackbar'],
    data(){
        return {
            id:'',
            name:'',
            icon: '',
            module: '',
            outModule: '',
            overlay :false
        }
    },
    methods:{
        setProperty(){
            this.id= this.category.id
            this.name= this.category.name
            this.icon= this.category.icon
            this.outModule= this.category.module // se lo paso 
           
        },
        active(){
          this.overlay = true
          const url = this.url.updateCategory
          axiosInstance.post(url,{
            token : this.token,
            id: this.id,
            name: this.name,
            icon: this.icon,
            module : this.module.id
          })
          .then(res => {
            
            if(res.error){
              this.DialogFullScreen.display = false
              const snackbar = {display:true,text:'Algo saliò mal',timeout:2500,color:'error'}
              this.$emit("setSnackbar",snackbar)
              this.overlay = false
              return
            }
            const snackbar = {display:true,text:'Actualizado correctamente',timeout:2500,color:'success'}
            this.$emit("setSnackbar",snackbar)
            this.$emit("_getCategories")
            this.overlay = false
            this.DialogFullScreen.display = false
          })
          .catch(err => {
            console.log(err)
          })
        }
    },
    computed : {
     disabledUpdate(){
       if(this.name === '' || this.icon === '' || this.module === ''){
         return true
       }else {
         return false
       }
     },
     validateIcon(){
       if(this.icon !== '' && this.icon.substring(0,4) !== 'mdi-'){
          return ['icono invàlido. Ejemplo: mdi-more']
       }
     },
   },
   created(){
       this.setProperty()
   },
}
</script>

