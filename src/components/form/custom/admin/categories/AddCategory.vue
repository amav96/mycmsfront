<template>
  <div>
      <FormGeneral :FormGeneral="FormGeneral" :disabledFGeneral="$_disabledFGeneral" @active="save($event)">
        <v-card-text >
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
          @exportVal="module = $event"
          />
          <v-text-field
            v-model.trim="icon"
            label="Icono"
            required
            color="dark"
            placeholder="mdi-plus"
            :rules="validateIcon"
          ></v-text-field>
        </v-card-text>
      </FormGeneral>
  </div>
</template>

<script>
import CompleteSimple from '@/components/form/reusable/select/CompleteSimple'
import FormGeneral from '@/components/form/reusable/forms/FormGeneral.vue'
import axiosInstance from '@/services/api/axiosInstance'
export default {
  components:{
    CompleteSimple,
    FormGeneral
  },
  props:{
    token: {
      type: String
    },
    url : {
      type: Object
    },
  },
  data(){
    return {
      FormGeneral:{
        title:'Agregar Categoria',
        icon:'mdi-plus',
      },
      module:'',
      name:'',
      icon:'',
    }
  },
  methods: {
    save(){
      axiosInstance.post(this.url.saveCategory,{
        token : this.token,
        module: this.module.id,
        name : this.name,
        icon : this.icon
        
      })
      .then(res => {
        if(res.error){
            const snackbar = {display:true,text:'Ocurrio un problema',timeout:2800,color:'error'}
            this.$emit("setSnackbar", snackbar)
            return
        }
        const snackbar = {display:true,text:'Creado correctamente',timeout:3500,color:'success'}
        this.$emit("setSnackbar", snackbar)
        this.$emit("callGetCategories")
        this.resetForm();
        
      })
      .catch(err => {
        console.log(err)
      })
    },
    resetForm(){
       this.name = ''
       this.icon = ''
     }
  },
   computed : {
     $_disabledFGeneral(){
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
  

}
</script>
