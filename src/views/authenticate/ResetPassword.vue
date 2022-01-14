<template>
  <div class="app ">
       <v-container class="container"  >
            <v-row class="row pa-0  d-flex grax justify-center align-center  flex-column ">
                <v-col  class="pa-0 d-flex justify-center" cols="12"  sm="6">
                    <template v-if="restore" >
                        <v-card class=" d-flex justify-center pa-6 rounded-lg d-flex flex-wrap alternativeScreen fullHeight"  width="450"  >
                            <template v-if="loading"  >
                                <div class="d-flex justify-center flex-column align-center" >
                                    <div>
                                        <v-card-subtitle >
                                        Enviando codigo
                                        </v-card-subtitle>
                                    </div>
                                    <div>
                                        <v-progress-circular
                                        :size="50"
                                        color="info"
                                        indeterminate
                                        >
                                    </v-progress-circular>  
                                    </div>
                                </div>
                            </template>
                            <template v-if="!loading " >
                                <div>
                                        <v-card-title >
                                        <h4>¡Hola! Para recuperar tu contraseña, ingresá tu email</h4>
                                        </v-card-title>
                                

                                    <template v-if="alert.display" >
                                        <v-col cols="12" sm="12">
                                            <AlertOutline
                                            :alert="alert"
                                            />
                                        </v-col>
                                    </template>   

                                    
                                        <v-form @submit.prevent="validateForm" id="sendFormRestore">
                                            <v-col cols="12" sm="12">
                                                <v-text-field
                                                label="Email"
                                                outlined
                                                dense
                                                :rules="rulesEmail"
                                                required
                                                v-model="$v.email.$model"
                                                :error="errorEmail"
                                                type="email"
                                                color="black"
                                                class="info--text labelCustom"
                                                >
                                                </v-text-field>
                                            </v-col>
                                            <v-col  cols="12" sm="12">
                                                <v-btn 
                                                block
                                                x-large 
                                                color="info"
                                                type="submit"
                                                form="sendFormRestore"
                                                :disabled="$v.$invalid"
                                                >
                                                Continuar
                                                </v-btn>
                                            </v-col>
                                        </v-form>
                                    
                                </div>
                            </template>
                        
                        </v-card>
                    </template>
                    <template v-else  >
                        <v-card class=" d-flex justify-center pa-4 rounded-lg d-flex flex-wrap alternativeScreen fullHeightMedium"  width="400" >
                            <div class="d-flex flex-column" >
                                <div class=" d-flex justify-center ">
                                    <v-card-title>
                                        Restablecer contraseña
                                    </v-card-title>
                                </div>
                                
                                <div class=" d-flex justify-center my-6" >
                                Revise su correo electrónico para encontrar un enlace para restablecer su contraseña. Si no aparece en unos minutos, revise su carpeta de correo no deseado.
                                </div>
                                <div class="d-flex justify-center  my-6" >
                                <v-btn to="/login" >
                                    Regresar para iniciar sesion
                                </v-btn>
                                </div>
                            </div>
                        </v-card>
                    </template>
                </v-col>
            </v-row>
        </v-container>
  </div>
</template>

<script>
import  Linear  from '@/components/loader/Linear'
import  AlertOutline  from '@/components/message/AlertOutline'
import {required, minLength, between, email, sameAs} from "vuelidate/lib/validators";
import axiosInstance from '@/services/api/axiosInstance'
export default {
  components:{
    AlertOutline,
    Linear
  },
  data(){
    return{
      email: '',
      password : '',
      alert : {
        display: false,
        title: '',
        },
      loading: false,
      restore : true
    }
  },
  validations:{
      email:{required,email},
  },
  methods:{

    validateForm() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log("error")
      } else {
        this.email = this.$v.email.$model
        this._restorePassword()
      }
    },
    _restorePassword() {
        this.loading  = true
        axiosInstance.post('/password_reset',{
         email : this.email
        })
        .then( res => {
            this.alert.display = false
            this.alert.title = ''
            this.restore = false
        })
        .catch(err => {
            console.log(err.response)
            if(err.response.status === 403 || err.response.status === 500 || err.response.status === 400){
                this.alert.display = true
                this.alert.title = err.response.data.error
            }
        })
        .finally(()=> {
            this.loading  = false
        })
    }
  },
  computed: {
      errorEmail(){
          let email = this.$v.email
          if(email.required.Lazy  && email.$invalid){
              return true
          }else{
            return false
          }
      },
      rulesEmail(){
        let email = this.$v.email
        let message = ['Email inválido']
       if(email.required  && email.$invalid){
           return message
       }
      },
    },
    
  
}
</script>

<style scoped>

.labelCustom .v-label {
color:rgb(158, 149, 149)  !important;
}
.labelCustom .v-icon {
color:rgb(158, 149, 149)  !important;
}

.v-card__text, .v-card__title {
    word-break: normal;
}

/* fullHeight */

.fullHeight{
    height:60vh;
}

/* fullHeightMedium */

.fullHeightMedium{
     height:60vh;
}


@media (max-width: 480px){
     

        .fullHeight{
            height:90vh;
        }

        .fullHeightMedium{
            height:90vh;
        }   

        
        
    }

</style>