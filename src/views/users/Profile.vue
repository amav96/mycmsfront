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
            <span class="headline">Mis datos</span>
          </div>
          <div class=" d-flex justify-center flex-column"
          v-for="(items,index) in templateUser" :key="index"
          
          >
            <div   class=" d-flex justify-start my-2">
              <span class="title">{{items.title}}</span>
            </div>
            <div  class=" d-flex justify-start my-2 py-0">
              <v-card class="widthUserUpdateCard  rounded-card"  elevation="1">
                <v-card-text class="px-0  py-0" >
                  <div :class="[singleItems.method !== null ? 'pointer d-flex justify-center flex-column my-2' : 'd-flex justify-center flex-column my-2']"  v-for="(singleItems,singleIndex) in items.content" :key="singleIndex" @click="handlerMethod(singleItems.method)">
                      <div class="d-flex justify-space-between    flex-row flex-wrap mx-5"   >
                        <div class="d-flex  justify-center flex-column ">
                          <div  >
                               {{singleItems.title}}
                          </div>
                          <div style="min-height:20px;" :class="[singleItems.divider ? 'mb-1' : '']" >
                            {{singleItems.value}}
                          </div>
                        </div>
                        <div class=" d-flex  align-self-center">
                          {{singleItems.titleAction}}
                        </div>
                      </div>
                       <template v-if="singleItems.divider">
                        <div>
                          <v-divider class="my-1" ></v-divider>
                        </div>
                      </template> 
                     
                    </div>
                  
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </div>
      <template v-if="updatePhoneDialog.display">
        <UpdatePhone :token="token" :userDB="userDB" :updatePhoneDialog="updatePhoneDialog" />
      </template>
       <template v-if="updateBirthdayDialog.display">
        <UpdateBirthday :token="token" :userDB="userDB" :updateBirthdayDialog="updateBirthdayDialog" />
      </template>
      <template v-if="updateGenderDialog.display">
        <UpdateGender :token="token" :userDB="userDB" :updateGenderDialog="updateGenderDialog" />
      </template>
    
    </v-container>
  
   </v-app>
</template>

<script>
import Drawer from '@/components/core/Drawer'
import DrawerAdmin from '@/components/core/DrawerAdmin'
import DrawerUser from '@/components/core/DrawerUser'
import UpdatePhone from '@/components/form/custom/user/UpdatePhone'
import UpdateBirthday from '@/components/form/custom/user/UpdateBirthday'
import UpdateGender from '@/components/form/custom/user/UpdateGender'
import gender from '@/helpers/Helpers/gender'
import {mapState} from 'vuex' 
export default {
  components: {
    Drawer,DrawerAdmin,DrawerUser,UpdatePhone,UpdateBirthday,UpdateGender
  },
  data(){
    return{
      templateUser:[],
      updatePhoneDialog:{
        display: false,
      },
      updateBirthdayDialog:{
        display: false,
      },
      updateGenderDialog:{
        display: false,
      }
    }
  },
  methods:{
    completeDataUser(){
      const templateUser = [
          {
            title:'Datos de cuenta' ,
            content:[
              {
                title:'Email' , value:this.userDB.email, titleAction:'' , method:null, divider:true
              },
              {
                title:'Contraseña' , value:'xxxxxx',titleAction:'Cambiar' , method:'updatePassword', divider:false
              }
            ]
          },
          {
            title:'Datos personales' ,
            content:[
              {
                title:'Nombre' , value:this.userDB.firstName + ' ' + this.userDB.lastName, titleAction:'Cambiar' , method:'updateName', divider:true
              },
              {
                title:'Documento' , value:this.userDB.identification, titleAction:'' , method:null, divider:true
              },
              {
                title:'Telefono' , value: this.userDB.phone !== '' ? this.userDB.phone : '' , titleAction:'Cambiar' , method:'updatePhone', divider:true
              },
              {
                title:'Cumpleaños' , value: this.userDB.birthday !== '' ? this.userDB.birthday : ''  , titleAction:'Cambiar' , method:'updateBirthday', divider:true
              },
              {
                title:'Genero' , value: this.userDB.gender !== '' ? gender.returnGenderFormat(this.userDB.gender)  : '' ,titleAction:'Cambiar' , method:'updateGender', divider:false
              }
            ]
          },
        ]
        this.templateUser = templateUser
    },
    handlerMethod(method){
      if(method !== null){
        
        this[method]()
      }
      
    },
    updatePassword(){
      this.$router.push('/profile/password')
    },
    updateName(){
      this.$router.push('/profile/name')
    },
    updatePhone(){
      this.updatePhoneDialog.display = true
    },
    updateBirthday(){
      this.updateBirthdayDialog.display = true
    },
    updateGender(){
      this.updateGenderDialog.display = true
    }

  },
  created(){
    this.completeDataUser();

  },
  computed:{
      ...mapState('auth',['userDB','token']),
      widthUserUpdateCard(){
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 280
          case 'sm': return 470
          case 'md': return 705
          case 'lg': return 800
          case 'xl': return 800
        }
      },
  },
  watch:{
   
    userDB: {
     handler(val){
       this.completeDataUser()
     },
     deep: true
  }
  }
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
.pointer{
  cursor: pointer !important;
}

.rounded-card{
    border-radius:11px;
}
</style>