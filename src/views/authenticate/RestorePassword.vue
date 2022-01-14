<template>
  <div class="app ">
    <v-overlay v-if="loading" />
      <Linear v-if="loading" />
        <v-container class="container"  >  
          <v-row class="row pa-0  d-flex grax justify-center align-center  flex-column ">
            <v-col  class="pa-0 d-flex justify-center" cols="12"  sm="6">
              <v-card class=" d-flex justify-center pa-6 rounded-lg d-flex flex-wrap alternativeScreen fullHeight"  width="450"  >
          
                <template v-if="!loading" >
                    <div>
                            <v-card-title >
                            <h4>Restablezca su contreña nueva</h4>
                            </v-card-title>
                      
                        <template v-if="alert.display" >
                          <v-col cols="12" sm="12">
                            <AlertOutline
                            :alert="alert"
                            />
                          </v-col>
                        </template>   

                            <v-form @submit.prevent="_resetPassword" id="sendResetPassword" >
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                    label="Nueva contraseña"
                                    outlined
                                    dense
                                    required
                                    v-model="$v.password.$model"
                                    :rules="rulesPassword"
                                    type="password"
                                    color="black"
                                    class="info--text labelCustom"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                    label="Confirmar contraseña"
                                    outlined
                                    dense
                                    required
                                    v-model="$v.confirmPassword.$model"
                                    :rules="rulesconfirmPassword"
                                    type="password"
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
                                    form="sendResetPassword"
                                    :disabled="$v.$invalid"
                                    >
                                    Continuar
                                    </v-btn>
                                </v-col>
                            </v-form>
                        
                    </div>
                </template>
              </v-card>
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
    return {
      password: "",
      confirmPassword : "",
      errorsBack : {
        password : "",
        confirmPassword : "",
      },
      alert : {
        display: false,
        title: '',
        },
      loading : false,
      

    };
  },
  validations:{
    password: {
      required,
      minLength: minLength(6),
    },
     confirmPassword: {
      required,
      sameAsPassword: sameAs('password')
    },
  },
  methods:{

    validateForm() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log("error")
      } else {
        this.password = this.$v.password.$model
        this.confirmPassword = this.$v.confirmPassword.$model
        this._resetPassword()
      }
    },
    _resetPassword() {
      this.loading = true
      const token = this.$route.params.token_validate
      axiosInstance.post('/restore_password',{
          token_validate : token,
          password : this.password,
          confirmPassword : this.confirmPassword
      })
      .then(res => {
        this.alert.display = false
        this.alert.title = ''
        this.$router.push('/login')
        
      })
      .catch(err => {
        this.alert.display = true
       if(err.response.status === 403 || err.response.status === 500 || err.response.status === 400){

          if(err.response.data.password){
           this.alert.title = err.response.data.password[0]
           return
         }
         
         if(err.response.data.confirmPassword){
           this.alert.title = err.response.data.confirmPassword[0]
           return 
         }

        
         this.alert.title = err.response.data.error
      
        }
      })
      .finally(()=> {
        this.loading = false
      })
        // this.loading  = true
    }
  },
  computed: {
     rulesPassword() {
      let password = this.$v.password;
      let message = ["Clave inválida"];
      if (password.required && !password.minLength) {
        return message;
      }
      if(this.errorsBack.password !== ""){
        return this.errorsBack.password;
      }
    },
    rulesconfirmPassword(){
      let confirmPassword = this.$v.confirmPassword
      let message = ["No coincide clave"];
      if(confirmPassword.required && !confirmPassword.sameAsPassword){
          return message;
      }
      if(this.errorsBack.confirmPassword !== ""){
        return this.errorsBack.confirmPassword;
      }
    },
    },
    created(){
      this.loading = true
     
      axiosInstance.get('/token_reset_pass/'+this.$route.params.token_validate)
        .then(res => {
         
          this.loading = false
        })
        .catch(err => {
      
          this.$router.push('/restorePassword');
           this.loading = false
          console.log(err)
        })
    
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
    height:70vh;
}



@media (max-width: 480px){
    
        .fullHeight{
            height:90vh;
        }
        
    }

</style>