<template>
  <div class="app">
    
    <v-overlay v-if="loading" />
      <Linear v-if="loading" /> 
        <v-container class="container" >  
          <v-row class="row pa-0  d-flex grax justify-center align-center  flex-column">
            <v-col  class="pa-0 d-flex justify-center" cols="12"  sm="6">
              <v-card class=" d-flex justify-center pa-6 rounded-lg d-flex flex-wrap alternativeScreen"  max-width="450">
                <v-col cols="12" sm="12">
                  <v-card-title >
                    <h4>¡Hola! Para seguir, ingresá tu email y clave </h4>
                  </v-card-title>
                </v-col>
                
                  <template v-if="alert.display" >
                      <AlertOutline
                      :alert="alert"
                      />
                  </template>                 
                
              <v-col cols="12" sm="12">
                <v-form @submit.prevent="validateForm" id="sendFormAuth">
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
                  
                  <v-col cols="12" sm="12">
                      <v-text-field
                        label="Clave"
                        outlined
                        dense
                        required
                        v-model="$v.password.$model"
                        :error="errorPassword"
                        type="password"
                        :rules="rulesPassword"
                        color="black"
                        class="info--text labelCustom"
                        
                      >
                      </v-text-field>
                  </v-col>
              
                  <v-col class="text-center" cols="12" sm="12">
                    <v-btn
                    :disabled="$v.$invalid"
                    x-large
                    block
                    color="info"
                    type="submit"
                    form="sendFormAuth"
                    >
                    Ingresar
                    </v-btn>
                  </v-col>
                
                  <v-col class="text-center pt-1" cols="12" sm="12">
                    <v-btn
                    x-large
                    block
                    to="/resetPassword"
                    >
                    No sé mi clave
                    </v-btn>
                    
                  </v-col>
                  <v-col class="text-center" cols="12" sm="12">
                    ¿No tienes cuenta? <v-chip to="/register" class="mx-1">Registrate</v-chip>
                  </v-col>
                </v-form>
              </v-col>

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
import {mapState, mapMutations, mapActions} from 'vuex'
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
      loading: false
    }
  },
  validations:{
      email:{required,email},
      password: {
        required,
        minLength: minLength(6)
      }
  },
  methods:{
    ...mapActions('auth',['setUser','redirectUser','setAuth']),
    validateForm() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log("error")
      } else {

        this.email = this.$v.email.$model
        this.password = this.$v.password.$model
        this.login()

      }
    },
    login(){
      try {
        this.loading  = true
      
        const credentials = {
          email : this.email,
          password : this.password
      }
      axiosInstance.post('/login',credentials)
        .then(res => {
         
             this.loading  = false
             if(res.data.success){  
               this.setUser(res.data)
               this.setAuth(true)
               this.$router.push('/')
             }
             if(res.data.error === 'baneado'){
              this.alert.display = true
              this.alert.title = 'Usuario suspendido'
             }  
             if(res.data.error === 'email_not_active'){
              this.alert.display = true
              this.alert.title = 'Usuario o contraseña incorrecta'
             }  

             if(res.data.error === 'invalid_credentials'){
              this.alert.display = true
              this.alert.title = 'Usuario o contraseña incorrecta'
             }  


        })
        .catch(error => {
            alert(error)
          console.log(error)
        })
        
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
     
  },
  computed: {
    ...mapState('auth',['userDB']),
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
      errorPassword(){
      let password = this.$v.password
       if(password.required && !password.minLength ){
           return true
       }else{
         return false
       }
      },
      rulesPassword(){
        let password = this.$v.password
        let message = ['Clave inválida']
       if(password.required && !password.minLength ){
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



</style>