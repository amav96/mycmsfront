<template>
    <v-app class="app" >
        <DrawerAdmin/> 
        <template v-if="RESOURCES.loading">
            <v-overlay opacity="2" color="white" >
                <v-progress-circular
                indeterminate
                size="64"
                color="info"
                ></v-progress-circular>
            </v-overlay>
        </template>

        <v-container>

            <div class="mt-3 my-1 mx-3" >
                <v-breadcrumbs class="pa-0"  :items="linkFollowed">
                    <template v-slot:divider>
                        <v-icon>mdi-chevron-right</v-icon>
                    </template>
                </v-breadcrumbs>
            </div>

        </v-container>
        
        <v-container>
            
            <v-row class="d-flex justify-start flex-row my-2" >
                <template>
                    <v-col  cols="12" lg="3" xl="3" sm="3"  xs="12">
                        <v-card outlined >
                            <v-card-title class="justify-center">
                                <div class="d-flex justify-center align-content-center align-items-center align-self-center">
                                    <div>
                                         Usuarios
                                    </div>
                                    <div class="d-flex">
                                        <v-icon>mdi-account-supervisor</v-icon>
                                    </div>
                                </div>
                            </v-card-title>
                            <v-card-text class="text-center">
                                <h1>{{users.data.count}}</h1>
                            </v-card-text>
                        </v-card> 
                    </v-col>
                    <v-col cols="12" lg="3" xl="3" sm="3"  xs="12" >
                        <v-card outlined>
                            <v-card-title class="justify-center">
                                <div class="d-flex justify-center align-content-center align-items-center align-self-center">
                                    <div>
                                        Productos  
                                    </div>
                                    <div class="d-flex">
                                        <v-icon>mdi-package-variant-closed</v-icon> 
                                    </div>
                                </div>
                               
                            </v-card-title>
                            <v-card-text class="text-center" >
                                <h1>{{products.data.count}}</h1>
                            </v-card-text>
                        </v-card> 
                    </v-col>
                    <template v-if="userDB.role === 'administrador'">
                        <v-col cols="12" lg="3" xl="3" sm="3"  xs="12" >
                            <v-card outlined>
                                <v-card-title class="justify-center">
                                    <div class="d-flex justify-center align-content-center align-items-center align-self-center">
                                        <div>
                                            Ordenes
                                        </div>
                                        <div class="d-flex">
                                            <v-icon>mdi-receipt</v-icon> 
                                        </div>
                                    </div>  
                                </v-card-title>
                                <v-card-text class="text-center" >
                                    <h1>0</h1>
                                </v-card-text>
                            </v-card> 
                        </v-col>
                    </template>
                    <template v-if="userDB.role === 'administrador'">
                        <v-col cols="12" lg="3" xl="3" sm="3"  xs="12" >
                            <v-card outlined>
                                <v-card-title class="justify-center">
                                    <div class="d-flex justify-center align-content-center align-items-center align-self-center">
                                         
                                         <div>
                                            Facturado 
                                         </div>
                                         <div class="d-flex">
                                            <v-icon>mdi-cash-100</v-icon> 
                                         </div>
                                    </div>  
                                </v-card-title>
                                <v-card-text class="text-center" >
                                    <h1>0</h1>
                                </v-card-text>
                            </v-card> 
                        </v-col>
                    </template>
                    
                    
                    
                </template>
                
            </v-row>
        </v-container>
      

   </v-app>
</template>

<script>
  import AppBar from '@/components/core/AppBar'
  import DrawerAdmin from '@/components/core/DrawerAdmin'
  import Snackbar from '@/components/message/Snackbar'
  import axiosInstance from '@/services/api/axiosInstance'
  import {mapState} from 'vuex'

  export default {
    components:{
      AppBar,DrawerAdmin,Snackbar
    },
    data () {
      return{
        users:{
            data:{
                count:0
            }
        },
        products:{
            data:{
                count:0
            }
        },
        RESOURCES: {
        loaders: {
            circular: false,
            linear: false,
        },
        // CUANDO LOADING ES TRUE ES PORQUE HAY PATICIONES EN CURSO
        loading: false,
        data: {
            response: [],
            auxResponse: [],
        },
        snackbar: {},
        api: {
            globalParameters: [],
        },
        error: {
            alert: {
            display: false,
            text: "",
            },
        },
        },
        linkFollowed: [
            {
              text: 'Panel',
              disabled: false,
              href: '',
            },
            {
              text: 'Estadísticas rápidas',
              disabled: false,
              href: '',
            },
          ],
      }
    },
    methods: {
        async _getQuickStats(){
            this.RESOURCES.loading = true
            await axiosInstance.get('/dashboard/quickStats',{
                params:{
                    token: this.token,
                }
            })
            .then(res => {
                this.RESOURCES.loading = false
                this.users.data.count = res.data.users
                this.products.data.count = res.data.products
            })
            .catch(err => {
                this.RESOURCES.loading = false
                console.log(err)
            })
           
        }
    },
    computed :{
        ...mapState('auth',['token','userDB','loadingBetweenRoutes','loadingGlobal']),
  
    },
    created() {
        this._getQuickStats()
    },
  }
</script>

