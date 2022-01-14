<template>
   <v-app class="app" >
    <template v-if="userDB && (userDB.role === 'administrador' || userDB.role === 'vendedor')" >
       <DrawerAdmin/> 
    </template>
    <template v-else-if="userDB && userDB.role === 'usuario'">
      <template  >
         <DrawerUser/> 
      </template>
    </template>
    <template v-else >
      <Drawer/> 
    </template>
    <v-container>
      <div class="my-4 mx-lg-16 mx-xs-1    d-flex justify-center  flex-column align-content-center">
        <div class="my-4 d-flex justify-center flex-column  max-width">
          <div  class=" d-flex justify-start my-2">
            <span class="headline">Cambiar clave</span>
          </div>
            <div  class=" d-flex justify-start my-2 py-0">
              <v-card class="widthUserUpdateCard pa-4"  elevation="1">
                <v-card-text class="px-0  py-0" >
                  <v-form @submit.prevent="_updatePassword" id="formPassword">
                    <v-row class="d-flex justify-start flex-row "  >
                        <v-col cols="12" xl="6" lg="6"  style="max-height:85px;"  >
                            <v-text-field 
                            outlined 
                            color="info"
                            label='Clave actual'
                            type="password"
                            v-model="updatePassword.password.current"
                            :error="error.password.current.display"
                            :rules="error.password.current.rules"
                            @input="validatePasswordCurrent()"
                            >
                            </v-text-field>
                        </v-col>
                        <v-col class=" d-flex justify-center align-self-start flex-column   py-2"  cols="12" xl="6" lg="6" >
                            <div>
                                  <span><strong>Como debe ser tu clave</strong> </span>
                            </div>
                            <div>
                                <span>
                                    Debe tener entre 6 y 20 caracteres.
                                    No incluyas tu nombre, apellido o e-mail, ni caracteres idénticos consecutivos.
                                </span>
                            </div>
                        </v-col>
                        
                        <v-col class="d-flex justify-start flex-column mt-0" cols="12" xl="6" lg="6" >
                            <v-text-field 
                            outlined 
                            color="info"
                            label='Nueva clave'
                            type="password"
                            v-model="updatePassword.password.new"
                            :error="error.password.new.display"
                            :rules="error.password.new.rules"
                            @input="validatePasswordNew()"
                            >
                            </v-text-field>
                             <v-text-field 
                            outlined 
                            color="info"
                            label='Confirme su clave nueva'
                            type="password"
                            v-model="updatePassword.password.confirm"
                            :error="error.password.confirm.display"
                            :rules="error.password.confirm.rules"
                            @input="validatePasswordConfirm()"
                             >
                            </v-text-field>
                            <v-btn class="info" 
                            type="submit"
                            form="formPassword"
                            style="min-width:180px;"
                            >
                              <template v-if="RESOURCES.loading" >
                                  <v-progress-circular
                                    indeterminate
                                    color="white"
                                  ></v-progress-circular>
                              </template>
                              <template v-else >
                                 Guardar cambios
                              </template>
                            </v-btn>
                        </v-col>
                    </v-row>
                  </v-form> 
                </v-card-text>
              </v-card>
            </div>
          </div>
      </div>
    </v-container>
  <Snackbar :snackbar="RESOURCES.snackbar" />
  </v-app>
</template>

<script>
import Drawer from '@/components/core/Drawer'
import DrawerAdmin from '@/components/core/DrawerAdmin'
import DrawerUser from '@/components/core/DrawerUser'
import Snackbar from '@/components/message/Snackbar'
import {mapState} from 'vuex'
import axiosInstance from '@/services/api/axiosInstance'
export default {
  components: {
    Drawer,DrawerAdmin,DrawerUser,Snackbar
  },
  data(){
    return{
      updatePassword:{
        url:'/account/update/password',
          password:{
            current:'',
            new:'',
            confirm:''
          }
      },
      error:{
        password:{
          current: {
            display: false,
            rules:[]
          },
          new: {
            display: false,
            rules:[]
          },
          confirm: {
            display: false,
            rules:[]
          },
          response:''
        }
      },
      RESOURCES: {
        loading: false,
        snackbar: {},
      }
      
    }
  },
  methods:{
      _updatePassword(){
        this.RESOURCES.loading = true
        const url = this.updatePassword.url
        axiosInstance.post(url,{
          token: this.token,
          currentPassword: this.updatePassword.password.current,
          newPassword: this.updatePassword.password.new,
          confirmPassword: this.updatePassword.password.confirm,
          _method: 'patch'
        })
        .then(res => {
            this.error.password.confirm.display = false
            this.error.password.confirm.rules =  []
            const snackbar = {display:true, text:res.data.success,timeout:2500,color:'success'}
            this.RESOURCES.snackbar = snackbar
            this.updatePassword.password.current = ''
            this.updatePassword.password.new = ''
            this.updatePassword.password.confirm = ''
            document.activeElement.blur();
        })
        .catch(err => {
          if(err.response.status === 400 || err.response.status === 500 || err.response.status === 403){
                 this.validateResponseSuccess(err.response)
              }
        })
        .finally(()=> {
              this.RESOURCES.loading = false
            })
      },
      validateResponseSuccess(res){

        if(res.data.currentPassword){
            this.error.password.current.display = true
            this.error.password.current.rules = [res.data.currentPassword[0]]
            return false
          }else{
            this.error.password.current.display = false
            this.error.password.current.rules = []
          }
          if(res.data.newPassword){
            this.error.password.new.display = true
            this.error.password.new.rules =  [res.data.newPassword[0]]
            return false
          }else{
            this.error.password.new.display = false
            this.error.password.new.rules =  []
          }
          if(res.data.confirmPassword){
            this.error.password.confirm.display = true
            this.error.password.confirm.rules =  [res.data.confirmPassword[0]]
            return false
          }else{
            this.error.password.confirm.display = false
            this.error.password.confirm.rules =  []
          }

          if(res.data.error){
            this.error.password.current.display = true
            this.error.password.current.rules = [res.data.error]
            return false
          }else{
            this.error.password.current.display = false
            this.error.password.current.rules = []
          }

      },
      validatePasswordCurrent(){
         if(this.updatePassword.password.current === ''){
           this.error.password.current.display = true
           this.error.password.current.rules = []
           return true
         }else if(this.updatePassword.password.current.length < 6){
            this.error.password.current.display = true
            this.error.password.current.rules = ['La clave debe ser mayor o igual a 6 digitos']
            return true
         }else{
            this.error.password.current.display = false
            this.error.password.current.rules = []
            return false
         }
         
      },
      validatePasswordNew(){
         if(this.updatePassword.password.new === ''){
           this.error.password.new.display = true
           this.error.password.new.rules = []
           return true
         }else if(this.updatePassword.password.new.length < 6){
            this.error.password.new.display = true
            this.error.password.new.rules = ['La clave debe ser mayor o igual a 6 digitos']
            return true
         }else if(this.updatePassword.password.new === this.updatePassword.password.current){
            this.error.password.new.display = true
            this.error.password.new.rules = ['La clave nueva debe ser diferente a la clave actual']
            return true
         }
         else{
            this.error.password.new.display = false
            this.error.password.new.rules = []
            return false
         }
         
      },
      validatePasswordConfirm(){
         if(this.updatePassword.password.confirm === ''){
           this.error.password.confirm.display = true
           this.error.password.confirm.rules = []
           return true
         }else if(this.updatePassword.password.confirm.length < 6){
            this.error.password.confirm.display = true
            this.error.password.confirm.rules = ['La clave debe ser mayor o igual a 6 digitos']
            return true
         }else if(this.updatePassword.password.confirm !== this.updatePassword.password.new){
            this.error.password.confirm.display = true
            this.error.password.confirm.rules = ['Las claves no coinciden']
            return true
         }else{
            this.error.password.confirm.display = false
            this.error.password.confirm.rules = []
            return false
         }
      },
  },
  computed:{
      ...mapState('auth',['token','userDB']),
      widthUserUpdateCard(){
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 280
          case 'sm': return 470
          case 'md': return 705
          case 'lg': return 800
          case 'xl': return 800
        }
      },
      validateForm(){
       if(this.updatePassword.password.current === '' || this.updatePassword.password.current.length < 6 || this.updatePassword.password.new === '' || this.updatePassword.password.new.length < 6 || this.updatePassword.password.confirm === '' || this.updatePassword.password.confirm.length < 6 || this.updatePassword.password.confirm !== this.updatePassword.password.new || this.updatePassword.password.current === this.updatePassword.password.new){
         return true
       }else{
         return false
       }
      },

    },
}
</script>

<style scoped >
.max-width{
  max-width:800px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.widthUserUpdateCard{
    width: 80vw;
}

.infoPassword{
    margin-top: -30px;
}

@media (min-width:1264px){
    .infoPassword{
        margin-top: 0px !important;
    }
}




</style>