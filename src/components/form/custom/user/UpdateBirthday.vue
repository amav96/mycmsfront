<template>
   <v-dialog
      v-model="updateBirthdayDialog.display"
      max-width="420"
    >
      <v-card class="pa-2">
        <v-card-title class="text-h5">
          Fecha de nacimiento
        </v-card-title>
    
        <v-form @submit.prevent="_updateBirthday" id="fromBirthday" >
            <v-card-text>
              <div class="d-flex justify-center flex-column align-items-center">
                    <v-date-picker width="250"  :max="maxBirthday" color="info" locale="es" v-model="updateBirthday.birthday.day"></v-date-picker>
                    <template v-if="error.birthday.day.display">
                        <div>
                            <v-alert type="error" >
                                {{error.birthday.day.rules[0]}}
                            </v-alert>
                        </div>
                    </template>
              </div>
            
            </v-card-text>

            <v-card-actions class="mx-2">
              <v-btn class="info" 
                type="submit"
                form="fromBirthday"
                style="min-width:130px;"
                >
                  <template v-if="RESOURCES.loading" >
                      <v-progress-circular
                        indeterminate
                        color="white"
                      ></v-progress-circular>
                  </template>
                  <template v-else >
                      Guardar
                  </template>
              </v-btn>
              <v-btn
                color="info"
                text
                @click="updateBirthdayDialog.display = false"
              >
                Cancelar
              </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script>

import date from '@/helpers/Helpers/date'
import axiosInstance from '@/services/api/axiosInstance'
export default {
    props:['updateBirthdayDialog','token','userDB'],
    data(){
        return {
            updateBirthday: {
              url: "/account/update/birthday",
              birthday: {
                day: "",
              },
            },
            error: {
              birthday: {
                day: {
                  display: false,
                  rules: [],
                },
              },
            },
            RESOURCES: {
              loading: false,
              snackbar: {},
            },
        }
    },
    methods:{
      _updateBirthday(){
      
          this.RESOURCES.loading = true
          const url = this.updateBirthday.url

          axiosInstance.post(url,{
          token: this.token,
          birthday: this.updateBirthday.birthday.day,
          _method: 'patch'
          })
          .then(res => {

            this.error.birthday.day.display = false
            this.error.birthday.day.rules = []
            this.$store.commit('auth/setBirthDay', date.returnDateFormatEs(this.updateBirthday.birthday.day) )
            this.updateBirthdayDialog.display = false
              
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

        if(res.data.birthday){
            this.error.birthday.day.display = true
            this.error.birthday.day.rules = [res.data.birthday[0]]
            return false
          }

      },
      validateBirthday(){
          if(this.updateBirthday.birthday.day === ''){
           this.error.birthday.day.display = true
           this.error.birthday.day.rules = ['Debes ingresar fecha de nacimiento']
           return true
        }else{
            this.error.birthday.day.display = false
            this.error.birthday.day.rules = []
            return false
        }

      },
      completeDataUser(){
        if(this.userDB.birthday !== '' && this.userDB.birthday !== undefined) {
            var birthday = JSON.parse(JSON.stringify(this.userDB.birthday)).split('-'); 
            this.updateBirthday.birthday.day = birthday[2]+'-'+birthday[1]+'-'+birthday[0]
        }
      }
    },
    computed:{
        maxBirthday(){
            return date.dateOver16()
        }
    },
    created() {
        this.completeDataUser()
    }
}
</script>

<style scoped >
 .datePicker{
     max-width: 60vw;
     margin: auto;
 }
</style>