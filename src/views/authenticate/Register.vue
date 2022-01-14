<template>
  <div>
    <v-overlay v-if="loading" />
    <Linear v-if="loading" />
    <v-container  class="container" >
      <v-row class="pa-0 d-flex justify-center flex-column  align-lg-center  align-center">
          <v-col class="pa-0" cols="12" lg="6" md="8" sm="8" xs="12" >
            <v-card
              class="d-flex justify-center  pa-6 rounded-lg d-flex flex-wrap alternativeScreen"
            >  
              <v-col class=" d-flex justify-center" cols="12" lg="12" md="12" sm="12" xs="12">
                
                <v-card-title>
                  <h4>Completa tus datos</h4>
                </v-card-title>
              </v-col>

              <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                <v-form @submit.prevent="register" id="sendFormRegister">
                  <v-row>

                    <v-col class="pa-1" cols="12" lg="6" md="6" sm="6" xs="12" >
                      <v-text-field
                        outlined
                        dense
                        label="Nombre"
                        :rules="rulesfirstName"
                        required
                        v-model="$v.firstName.$model"
                        type="text"
                        class="info--text labelCustom"
                      >
                      </v-text-field>
                    </v-col> 

                    <v-col class="pa-1" cols="12" lg="6" md="6" sm="6" xs="12">
                      <v-text-field
                        outlined
                        dense
                        label="Apellido"
                        :rules="ruleslastName"
                        required
                        v-model="$v.lastName.$model"
                        type="text"
                        class="info--text labelCustom"
                      >
                      </v-text-field>
                    </v-col> 

                      <v-col class="pa-1" cols="12" lg="6" md="6" sm="6" >
                        <v-text-field
                          outlined
                          dense
                          label="DNI"
                          required
                          :rules="rulesidentification"
                          v-model="$v.identification.$model"
                          type="text"
                          class="info--text labelCustom "
                        >
                        </v-text-field>
                    </v-col>  
                    
                    <v-col class="pa-1" cols="12" lg="6" md="6" sm="6">
                      <v-text-field
                        outlined
                        dense
                        append-icon="mdi-at"
                        label="Email"
                        :rules="rulesEmail"
                        required
                        v-model="$v.email.$model"
                        type="email"
                        class="info--text labelCustom"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col class="pa-1" cols="12" lg="6" md="6" sm="6">
                      <v-text-field
                        outlined
                        dense
                        label="Clave"
                        required
                        v-model="$v.password.$model"
                        type="password"
                        :rules="rulesPassword"
                        class="info--text labelCustom"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col class="pa-1" cols="12" lg="6" md="6" sm="6">
                      <v-text-field
                        outlined
                        dense
                        label="Repetir clave"
                        required
                        v-model="$v.confirmPassword.$model"
                        type="password"
                        :rules="rulesconfirmPassword"
                        class="info--text labelCustom"
                      >
                      </v-text-field>
                    </v-col>

                  </v-row>
                </v-form>
              </v-col>
              <template v-if="errorsBack.error !== ''" >
                <v-col  cols="12" lg="12">
                  <v-alert color="error" class="white--text" >
                    {{errorsBack.error}}
                  </v-alert>
                </v-col>
              </template>
              
              <v-col  cols="12" lg="12">
                <v-btn x-small to="/login" >Tengo cuenta</v-btn> 
              </v-col>
            </v-card>
              <div class="btnSend">
                <v-btn
                :disabled="$v.$invalid || loading"
                x-large
                color="info"
                primary
                type="submit"
                form="sendFormRegister"
                class="my-4"
                >
                Continuar
                </v-btn>
              </div>
          </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import  Linear  from '@/components/loader/Linear'
import {required,minLength,email,sameAs,} from "vuelidate/lib/validators";
import axiosInstance from '@/services/api/axiosInstance'
export default {
  components: {
    Linear
  },
  data() {
    return {
      email: "",
      password: "",
      confirmPassword : "",
      firstName:"",
      lastName: "",
      identification: "",
      errorsBack : {
        email : "",
        password : "",
        confirmPassword : "",
        firstName: "",
        lastName : "",
        identification: "",
        error:""
      },
      loading : false
    };
  },
  validations: {
    email: { required, email },
    password: {
      required,
      minLength: minLength(6),
    },
     confirmPassword: {
      required,
      sameAsPassword: sameAs('password')
    },
    firstName : {
      required
    },
    lastName : {
      required
    },
    identification: {
      required,
      minLength: minLength(6),
    }
  },
  methods: {
    register() {
      this.errorsBack.email !== '' ? this.errorsBack.email = '' : true;
      this.errorsBack.identification !== '' ? this.errorsBack.identification = '' : true;
      this.errorsBack.password !== '' ? this.errorsBack.password = '' : true; 
      this.errorsBack.confirmPassword !== '' ? this.errorsBack.confirmPassword = '' : true;
      this.errorsBack.firstName !== ''  ? this.errorsBack.firstName = '' : true; 
      this.errorsBack.lastName !== ''  ? this.errorsBack.lastName = '' : true;
      this.loading = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("error");
      } else {

      axiosInstance.post('/register',{
          email :this.email ,
          password :this.password ,
          confirmPassword :this.confirmPassword ,
          firstName :this.firstName ,
          lastName :this.lastName ,
          identification :this.identification 
      })
        .then(res => {
            this.$router.push(`registration/${res.data.token}`)
            this.$v.email.$model = ''
            this.$v.password.$model = ''
            this.$v.confirmPassword.$model = ''
            this.$v.firstName.$model = ''
            this.$v.lastName.$model = ''
            this.$v.identification.$model = ''
            this.errorsBack.error = ''
            this.errorsBack.email = ''
            this.errorsBack.identification = ''
            this.errorsBack.password = ''
            this.errorsBack.confirmPassword = ''
            this.errorsBack.firstName = ''
            this.errorsBack.lastName = ''
            
        })
        .catch(err => {
          if(err.response.status == 400 || err.response.status == 403){
            err.response.data.email ? this.errorsBack.email = err.response.data.email : true;
            err.response.data.identification ? this.errorsBack.identification = err.response.data.identification: true  ; 
            err.response.data.password ? this.errorsBack.password = err.response.data.password : true;
            err.response.data.confirmPassword ? this.errorsBack.confirmPassword = err.response.data.confirmPassword: true ;  
            err.response.data.firstName ? this.errorsBack.firstName = err.response.data.firstName: true ; 
            err.response.data.lastName ? this.errorsBack.lastName = err.response.data.lastName: true ;
          }
          if(err.response.status == 500 ){
            this.errorsBack.error = err.response.data.error
          }
        
        })
        .finally(()=>{
          this.loading = false;
        })
        
      }
    },
  },
  computed: {
   
    rulesidentification() {
      let identification = this.$v.identification;
      let message = ["Documento inválido"];
      if (identification.required && !identification.minLength) {
        return message;
      }
      if(this.errorsBack.identification !== ""){
        return this.errorsBack.identification;
      }
      
    },
    rulesEmail() {
      let email = this.$v.email;
      let message = ["Email inválido"];
      if (email.required && email.$invalid) {
        return message;
      }
      if(this.errorsBack.email !== ""){
        return this.errorsBack.email;
      }
    },
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
    rulesfirstName(){
      if(this.errorsBack.firstName !== ""){
        return this.errorsBack.firstName;
      }
    },
    ruleslastName(){
      if(this.errorsBack.lastName !== ""){
        return this.errorsBack.lastName;
      }
    }
    ,
  },
};

</script>

<style>
.labelCustom .v-label {
  color: rgb(158, 149, 149) !important;
}
.labelCustom .v-icon {
  color: rgb(158, 149, 149) !important;
}

.btnSend{
  display: flex;
  justify-content: center;
}
@media (min-width:620px){

  .btnSend{
    display: block;
  }

}

</style>
