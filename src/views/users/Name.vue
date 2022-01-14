<template>
  <v-app class="app">
    <template
      v-if="
        userDB &&
        (userDB.role === 'administrador' || userDB.role === 'vendedor')
      "
    >
      <DrawerAdmin />
    </template>
    <template v-else-if="userDB && userDB.role === 'usuario'">
      <template>
        <DrawerUser />
      </template>
    </template>
    <template v-else>
      <Drawer />
    </template>
    <v-container>
      <div class="my-4 mx-lg-16 mx-xs-1    d-flex justify-center  flex-column align-content-center">
        <div class="my-4 d-flex justify-center flex-column  max-width">
          <div  class=" d-flex justify-start my-2">
            <span class="headline text-center ">¿Cómo querés que te llamemos?</span>
          </div>
          <div class="d-flex justify-center my-2 py-0">
            <v-card
              class="widthUserUpdateCard pa-4 px-5 rounded-card"
              elevation="0"
            >
              <v-card-text class="px-0 py-0">
                <v-form @submit.prevent="_updateName" id="formName">
                  <v-row class="d-flex justify-start flex-column">
                    <v-col cols="12" xl="6" lg="6">
                      <v-text-field
                        v-model="updateName.name.firstName"
                        color="info"
                        label="Nombre"
                        :error="error.name.firstName.display"
                        :rules="error.name.firstName.rules"
                        @input="validateFirstName()"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" xl="6" lg="6">
                      <v-text-field
                        v-model="updateName.name.lastName"
                        color="info"
                        label="Apellido"
                        :error="error.name.lastName.display"
                        :rules="error.name.lastName.rules"
                        @input="validateLastName()"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" xl="6" lg="6">
                      <v-btn class="info" 
                            type="submit"
                            form="formName"
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
import Drawer from "@/components/core/Drawer";
import DrawerAdmin from "@/components/core/DrawerAdmin";
import DrawerUser from "@/components/core/DrawerUser";
import Snackbar from "@/components/message/Snackbar";
import { mapState } from "vuex";
import axiosInstance from '@/services/api/axiosInstance'
export default {
  components: {
    Drawer,
    DrawerAdmin,
    DrawerUser,
    Snackbar,
  },
  data() {
    return {
      updateName: {
        url: "/account/update/name",
        name: {
          firsName: "",
          lastName: "",
        },
      },
      error: {
        name: {
          firstName: {
            display: false,
            rules: [],
          },
          lastName: {
            display: false,
            rules: [],
          },

          response: "",
        },
      },
      RESOURCES: {
        loading: false,
        snackbar: {},
      },
    };
  },
  methods: {
      _updateName(){
            this.RESOURCES.loading = true
            const url = this.updateName.url
            axiosInstance.post(url,{
                token: this.token,
                firstName: this.updateName.name.firstName,
                lastName: this.updateName.name.lastName,
                _method: 'patch'
            })
            .then(res => {
                this.error.name.lastName.display = false
                this.error.name.firstName.display = false
                this.error.name.lastName.rules =  []
                this.error.name.firstName.rules = []
                this.$store.commit('auth/setFirstName', this.updateName.name.firstName)
                this.$store.commit('auth/setLastName', this.updateName.name.lastName)
                const snackbar = {display:true, text:res.data.success,timeout:2500,color:'success'}
                this.RESOURCES.snackbar = snackbar
                document.activeElement.blur();
    
            })
            .catch(err => {
              
              if(err.response.status === 400 || err.response.status === 500){
                 this.validateResponseSuccess(err.response)
              }
             
            })
            .finally(()=> {
              this.RESOURCES.loading = false
            })
      },
      validateResponseSuccess(res){
        
        if(res.data.firstName){
            this.error.name.firstName.display = true
            this.error.name.firstName.rules = [res.data.firstName[0]]
            return 
          }else{
            this.error.name.firstName.display = false
            this.error.name.firstName.rules = []
          }
          if(res.data.lastName){
            this.error.name.lastName.display = true
            this.error.name.lastName.rules =  [res.data.lastName[0]]
            return 
          }else{
            this.error.name.lastName.display = false
            this.error.name.lastName.rules =  []
          }
          if(res.data.error){
            this.error.name.firstName.display = true
            this.error.name.firstName.rules = [res.data.error]
            this.error.name.lastName.display = true
            this.error.name.lastName.rules =  [res.data.error]
            return 
          }

      },
      validateFirstName(){

        if(this.updateName.name.firstName === ''){
           this.error.name.firstName.display = true
           this.error.name.firstName.rules = ['Debe ingresar nombre']
           return true
        }else{
            this.error.name.firstName.display = false
            this.error.name.firstName.rules = []
            return false
        }

      },
      validateLastName(){

          if(this.updateName.name.lastName === ''){
           this.error.name.lastName.display = true
           this.error.name.lastName.rules = ['Debe ingresar apellido']
           return true
        }else{
            this.error.name.lastName.display = false
            this.error.name.lastName.rules = []
            return false
        }

      }

  },
  computed: {
    ...mapState("auth", ["token", "userDB"]),
  },
  mounted(){
      this.updateName.name.firstName = this.userDB.firstName
      this.updateName.name.lastName =this.userDB.lastName
  }
};
</script>

<style scoped >
.max-width {
  max-width: 800px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.widthUserUpdateCard {
  width: 80vw;
}

.infoPassword {
  margin-top: -30px;
}

.rounded-card {
  border-radius: 9px;
}

@media (min-width: 1264px) {
  .infoPassword {
    margin-top: 0px !important;
  }
}
</style>