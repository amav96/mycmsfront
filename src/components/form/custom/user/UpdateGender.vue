<template>
   <v-dialog
      v-model="updateGenderDialog.display"
      max-width="420"
    >
      <v-card class="pa-2">
        <v-card-title class="text-h5">
          Género
        </v-card-title>
        <v-form @submit.prevent="_updateGender" id="formGender" >
            <v-card-text>
              <div class="d-flex justify-center flex-column">
                  <div >
                    <v-select
                    v-model="updateGender.gender.sex"
                    color="info"
                    label="Género"
                    :items="genders"
                    item-text="text"
                    item-id="value"
                    :error="error.gender.sex.display"
                    :rules="error.gender.sex.rules"
                    @input="validateGender()"
                    >
                    </v-select>
                  </div>
              </div>
            </v-card-text>

            <v-card-actions class="mx-2">
              <v-btn class="info" 
                type="submit"
                form="formGender"
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
                @click="updateGenderDialog.display = false"
              >
                Cancelar
              </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script>
import gender from '@/helpers/Helpers/gender'
import axiosInstance from '@/services/api/axiosInstance'
export default {
    props:['updateGenderDialog','token','userDB'],
    data(){
        return {
            updateGender: {
              url: "/account/update/gender",
              gender: {
                sex: "",
              },
            },
            error: {
              gender: {
                sex: {
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
      _updateGender(){
          this.RESOURCES.loading = true
            const url = this.updateGender.url
            axiosInstance.post(url,{
                token: this.token,
                gender: this.updateGender.gender.sex,
                _method: 'patch'
            })
            .then(res => {
              this.error.gender.sex.display = false
              this.error.gender.sex.rules = []
              this.$store.commit('auth/setGender', this.updateGender.gender.sex)
              this.updateGenderDialog.display = false
            
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

        if(res.data.gender){
            this.error.gender.sex.display = true
            this.error.gender.sex.rules = [res.data.gender[0]]
            return false
          }else if(res.data.error){
            this.error.gender.sex.display = true
            this.error.gender.sex.rules = [res.data.error]
          }
          else{
            this.error.gender.sex.display = false
            this.error.gender.sex.rules = []
          }
          return true

      },
      validateGender(){
          if(this.updateGender.gender.sex === ''){
           this.error.gender.sex.display = true
           this.error.gender.sex.rules = ['Debe seleccionar género']
           return 
        }
      },
      completeDataUser(){
        console.log(this.userDB)
        if(this.userDB.gender !== '' && this.userDB.gender !== undefined) {
          this.updateGender.gender.sex = this.userDB.gender
        }
      }
      
    },
    computed:{
        genders(){
            return gender.genders()
        }
    },
    created() {
      this.completeDataUser()
    }
}
</script>

<style >
.v-list .v-list-item--active { 
  color: #61605b !important;
}
</style>

