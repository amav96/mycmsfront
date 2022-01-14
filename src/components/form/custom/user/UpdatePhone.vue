<template>
   <v-dialog
      v-model="updatePhoneDialog.display"
      max-width="420"
    >
      <v-card class="pa-2">
        <v-card-title class="text-h5">
          Modificar telefono
        </v-card-title>
        <v-form @submit.prevent="_updatePhone" id="formPhone" >
            <v-card-text>
              <div class="d-flex justify-center flex-column">
                  <div>
                    <v-text-field
                    label="Telefono"
                    color="info"
                    v-model="updatePhone.phone.number"
                    :error="error.phone.number.display"
                    :rules="error.phone.number.rules"
                    @input="validatePhone()"
                    hint="Código de área + Nº. Ejemplo: 11 23456789"
                    persistent-hint
                    >
                    </v-text-field>
                  </div>
              </div>
            </v-card-text>

            <v-card-actions class="mx-2">
              <v-btn class="info" 
                type="submit"
                form="formPhone"
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
                @click="updatePhoneDialog.display = false"
              >
                Cancelar
              </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script>
import axiosInstance from '@/services/api/axiosInstance'
export default {
    props:['updatePhoneDialog','token','userDB'],
    data(){
        return {
            updatePhone: {
              url: "/account/update/phone",
              phone: {
                number: "",
              },
            },
            error: {
              phone: {
                number: {
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
      _updatePhone(){
        if(this.updatePhone.phone.number && this.updatePhone.phone.number !== ''){
          this.updatePhone.phone.number = this.updatePhone.phone.number.replace(/[^0-9]+/g, "")
        }
        
        this.$nextTick(()=>{
          this.RESOURCES.loading = true
          const url = this.updatePhone.url
          axiosInstance.post(url,{
              token: this.token,
              phone: this.updatePhone.phone.number,
              _method: 'patch'
            
          })
          .then(res => {
              this.error.phone.number.display = false
              this.error.phone.number.rules = []
              this.$store.commit('auth/setPhone', this.updatePhone.phone.number)
              this.updatePhoneDialog.display = false
          })
          .catch(err => {
            if(err.response.status === 400 || err.response.status === 500){
              this.validateResponseSuccess(err.response)
            }
          })
          .finally(()=> {
            this.RESOURCES.loading = false
            })
           
        })
       

      },
      validateResponseSuccess(res){

          if(res.data.phone){
            this.error.phone.number.display = true
            this.error.phone.number.rules = [res.data.phone[0]]
            return 
          }else if(res.data.error){
            this.error.phone.number.display = true
            this.error.phone.number.rules = [res.data.error]
            return 
          }
          

      },
      validatePhone(){
          if(this.updatePhone.phone.number === ''){
           this.error.phone.number.display = true
           this.error.phone.number.rules = ['Debe ingresar numero']
           return true
        }else if(this.updatePhone.phone.number.length<10 || this.updatePhone.phone.number.length>10){
            this.error.phone.number.display = true
            this.error.phone.number.rules = ['El numero debe tener 10 digitos']
            return false
        }
        else{
            this.error.phone.number.display = false
            this.error.phone.number.rules = []
            return false
        }

      },
      completeDataUser(){
        if(this.userDB.phone !== '' && this.userDB.phone !== undefined) {
          this.updatePhone.phone.number = this.userDB.phone
        }
      }
      
    },
    created() {
      this.completeDataUser()
    }
}
</script>

<style>

</style>