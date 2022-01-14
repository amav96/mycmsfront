<template>
    <div >

        <Linear v-if="loading" />
        <v-overlay v-if="loading" />
        
        <v-container class="container"  >
                <div  v-if="validateRoute" >
                    <v-row class="pa-0 d-flex justify-center flex-column  align-lg-center  align-center " >
                        <v-col class="pa-0"  cols="12" lg="5" md="6" sm="8" xs="5" >
                            <v-card class="justify-center px-1 py-6  mx-auto alternativeScreen" max-width="450" >
                                        <v-card-title class="text-center my-2 ">
                                            <span class="title-validate wrap-text" >Ingresá el código que te enviamos por e-mail</span> 
                                        </v-card-title>

                                        <v-card-subtitle class="my-2 font-weight-medium subtitle-1">
                                            Lo enviamos a {{mail}} para confirmar que te pertenece. Si no lo encontrás revisá tu carpeta de correo no deseado / spam 
                                            .
                                        </v-card-subtitle>

                                        <v-card-subtitle>
                                            
                                            <v-form  @submit.prevent="$_validateCode()" id="sendFormValidate"> 
                                                <v-row class="d-flex flex-column justify-center align-content-center">
                                                    <div class="d-flex justify-center" >
                                                        <template v-if="alert.display" >
                                                            
                                                            <AlertOutline
                                                            :alert="alert"
                                                            />
                                                        </template>
                                                        
                                                    </div>
                                                    <div class="d-flex justify-center" >
                                                        <input 
                                                        type="number" 
                                                        class="input"
                                                        v-model="code"
                                                        @keyup="$_cleanCode()"
                                                        >
                                                    </div>
                                                </v-row>
                                            </v-form>
                                            
                                        </v-card-subtitle>

                                        <v-card-actions class=" d-flex justify-center mt-5" >
                                            <v-btn class="py-5"
                                                type="submit"
                                                form="sendFormValidate"
                                                :disabled="fullForm || loading"
                                                block 
                                                color="info" >
                                                Continuar
                                            </v-btn>
                                        </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
                <div v-if="errorRoute" >
                    <ErrorRoute/>
                </div>
        </v-container>

    </div>
</template>

<script>
import  Linear  from '@/components/loader/Linear'
import  AlertOutline  from '@/components/message/AlertOutline'
import  ErrorRoute  from '@/components/message/ErrorRoute'
import  FullScreen from '@/components/loader/FullScreen'
import axiosInstance from '@/services/api/axiosInstance'
export default {
    components: {
    AlertOutline,
    ErrorRoute,
    FullScreen,
    Linear
  },
    data(){
        return {
            code : '',
            alert : {
                display: false,
                title: '',
            },
            mail : '',
            validateRoute : false,
            errorRoute : false,
            loading : true
        }
    },
    methods: {
        
        $_validateCode(){
            const code  = this.code
            const token_validate = this.$route.params.token_validate
            this.loading = true
            axiosInstance.get('/validateCode',{
                params : {
                    code,
                    token_validate
                }
            })
            .then(res => {
                this.alert.display = false;
                this.alert.title = ''
                this.$router.push('/login')
            })
            .catch(err => {
                 if(err.response.status == 404 ){
                    this.alert.display = true;
                    this.alert.title = err.response.data.error
                }
                
            })
            .finally(()=> {this.loading = false})
        },
        $_cleanCode(){
            if(this.code.length > 4){
                this.code = this.code.substr(0,4);
            }
        },
        $_validateUrlAndEmail(){

            const token_validate = this.$route.params.token_validate
            axiosInstance.get('/checkTokenRegister/'+token_validate)
            .then(res => {
                this.mail = res.data.email
                this.errorRoute = false
                this.validateRoute = true
            })
            .catch(err => {
                
                if(err.response.status === 403 || err.response.status === 500){
                    this.validateRoute = false
                    this.errorRoute = true
                    this.$router.push('/login')
                }
            })
            .finally(() =>{
                 this.loading = false
            })
        
        },
        
    },
    computed : {
        fullForm(){
          if(this.code === '' || this.code.length <4){
              return true
          }else {
              return false
          }
        }

    },
    created(){
        this.loading = true
        this.$_validateUrlAndEmail()
    },
    
}


</script>

<style scoped >
    .title-validate{
        font-weight: 500;
        font-size: 1.5rem;
    }

    .v-card__text, .v-card__title {
        word-break: normal;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }
   

    .input{
        border-radius: .375em;
        background-color: #fff;
        font-size: 16px;
        box-shadow: 0 0 0 1px rgb(0 0 0 / 25%);
        min-height: 48px;
        margin: auto 5px;
        text-align: center;
        letter-spacing:10px;
        /* outline-color: rgb(70, 148, 236) ; */
        outline: none;
    }

    


   

    
</style>
