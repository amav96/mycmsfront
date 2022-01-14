<template>
    <div>
        <template v-if="update.dialog.display">
            <DialogMediaScreen :DialogMediaScreen="update.dialog">
                <div class="mt-2">
                    <v-row class="d-flex flex-row mx-2 my-0" >
                        <v-col class="d-flex justify-center" cols="12" lg="12" xl="12" sm="12" xs="12" >
                            <v-icon size="80">mdi-account-circle</v-icon>
                        </v-col>
                        <v-col cols="12" lg="6" xl="6" sm="6" xs="6" >
                            <strong>Nombre :</strong> {{update.user.firstName}} {{update.user.lastName}}
                        </v-col>
                        <v-col cols="12" lg="6" xl="6" sm="6" xs="6" >
                            <strong>Email :</strong> {{update.user.email}}
                        </v-col>
                        <v-col cols="12" lg="6" xl="6" sm="6" xs="6" >
                            <strong>Fecha de registro :</strong> {{update.user.created_at}}
                        </v-col>
                        <v-col cols="12" lg="6" xl="6" sm="6" xs="6" >
                            <strong>Estado actual :</strong> {{showStatus(update.user.status)}} 
                        </v-col>
                        <v-col cols="12" lg="6" xl="6" sm="6" xs="6" >
                            <strong>Rol actual :</strong> {{update.user.role}} 
                        </v-col>
                    </v-row>
                    <v-row class="d-flex flex-column mx-2" >
                            <v-col cols="12" lg="8" xl="8" sm="12" xs="12" >
                                <v-select
                                v-model="update.Vstatus"
                                dense
                                color="info"
                                label="Estado"
                                :items="update.status"
                                item-text="slug"
                                item-value="id"
                                clearable
                                :error="update.validate.status.error"
                                :rules="update.validate.status.rule"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" lg="8" xl="8" sm="12" xs="12" >
                                <v-select
                                v-model="update.Vrole"
                                dense
                                color="info"
                                label="Rol"
                                :items="update.roles"
                                item-text="slug"
                                item-value="id"
                                clearable
                                :error="update.validate.role.error"
                                :rules="update.validate.role.rule"
                                ></v-select>
                            </v-col>
                             <v-col cols="12" lg="8" xl="8" sm="12" xs="12" >
                                 <v-select
                                v-model="update.Vmotive"
                                dense
                                color="info"
                                label="Motivo del cambio"
                                :items="update.motives"
                                item-text="slug"
                                item-value="id"
                                clearable
                                :error="update.validate.motive.error"
                                :rules="update.validate.motive.rule"
                                ></v-select>
                            </v-col>
                    </v-row>
                  
                    <v-btn  @click="_updateUser(update.user.id)" color="info" class="mx-4 my-2" >
                        Guardar cambios
                    </v-btn>
                </div>
                
                
            </DialogMediaScreen>
        </template>
        <v-simple-table class="table" >
            <template v-slot:default>
            <thead>
                <tr >
                <th v-for="column in resources.table.columns" :key="column.text" class="text-left">
                    {{column.text}}
                </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in resources.data.response" :key="row.id">
                    <td>{{row.id}}</td>
                    <td>{{row.firstName}}</td>
                    <td>{{row.lastName}}</td>
                    <td>{{row.identification}}</td>
                    <td>{{row.email}}</td>
                    <td>{{row.role}}</td>
                    <td>{{showStatus(row.status)}}</td>
                    <td>{{row.created_at}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <template v-if="isAdmin" >
                            <div class="my-1 d-flex flex-row">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn @click="openEdit(row)" class="mx-1" dark elevation="1" fab  x-small v-bind="attrs" v-on="on" color="grey lighten-3">
                                            <v-icon color="grey lighten-1">
                                                mdi-pencil
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                            </div>
                        </template>
                    </td>  
                </tr> 
            </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script>
import axiosInstance from '@/services/api/axiosInstance'
import DialogMediaScreen from '@/components/dialog/reusable/DialogMediaScreen'
import {mapState} from 'vuex'
export default {
    components: {
        DialogMediaScreen
    },
    props: ['columns','resources','routes'],
    data(){
        return{
            update:{
                dialog:{
                    display: false,
                    title:'Actualizar usuario',
                    maxWidth: 600,
                    dark: true,
                    color: 'info',
                    persistent: true,
                    hideOverlay: false,
                    heightToolbar:"80"
                },
                user:[],
                status:[
                    {slug:'Activo',id:'activo'},
                    {slug:'Esperando validar mail',id:'esperando_validar'},
                    {slug:'Baja voluntaria',id:'baja_voluntaria'},
                    {slug:'Suspendido',id:'baneado'},
                ],
                roles:[
                    {slug:'Usuario',id:'usuario'},
                    {slug:'Vendedor',id:'vendedor'},
                    {slug:'Administrador',id:'administrador'},
                ],
                motives:[
                    {slug:'No le llega el email',id:'no_llega_email'},
                    {slug:'Datos erroneos',id:'datos_erroneos'},
                    {slug:'Cambio de rol',id:'cambio_rol'},
                    {slug:'Cambio de estado',id:'cambio_estado'},
                    {slug:'Infracciòn de reglas',id:'infraccion_reglas'},
                ],
                Vstatus:'',
                Vrole:'',
                Vmotive:'',
                validate:{
                    status:{
                        error : false,
                        rule : []
                    },
                    role:{
                        error : false,
                        rule : []
                    },
                    motive:{
                        error : false,
                        rule : []
                    }
                }
            }
        }
    },
    methods : {
        openEdit(data){
            this.update.dialog.display = true
            this.update.user = data
            this.update.Vstatus = data.status
            this.update.Vrole = data.role
        },
        showStatus(data){
            var status = data
            if(data === 'activo'){status = 'Activo'}
            if(data === 'baja_voluntaria'){status = 'Baja voluntaria'}
            if(data === 'esperando_validar'){status = 'Esperando validar mail'}
            if(data === 'baneado'){status = 'Suspendido'}
            return status;
        },
        async _updateUser(id){
            axiosInstance.get('/user/updateUser',{
                params:{
                    token: this.token,
                    role:this.update.Vrole,
                    status : this.update.Vstatus,
                    motive : this.update.Vmotive,
                    id,
                     id_admin : this.userDB.id
                }
            })
            .then(res => {
                this.$msg('Actualizado correctamente',5000,'success'); 
                this.$emit("updateData")
                this.update.dialog.display = false
                this.update.Vmotive = ''
            })
            .catch(err => {
                this.resetValidate()
                if(err.response.status === 400 || err.response.status === 500 || err.response.status === 403){
                    if(err.response.data.error){
                        this.$msg(err.response.data.error,5000,'error'); return;
                    }
                    if(err.response.data.id_admin){
                        this.$msg(err.response.data.id_admin[0],5000,'error'); return;
                    }else if(err.response.data.motive){
                        this.update.validate.motive.error = true; this.update.validate.motive.rule = err.response.data.motive;return
                    }else if(err.response.data.status){
                        this.update.validate.status.error = true; this.update.validate.status.rule = err.response.data.status;return
                    }else if(err.response.data.role){
                        this.update.validate.role.error = true; this.update.validate.role.rule = err.response.data.role;return
                    }
                }
            })
        },
        $msg(msg, time, type) {
            const error = {
                display : true,
                text: msg,
                timeout: time,
                color: type,
            };
            this.$emit("setError", error);
        },
        resetValidate(){
            this.update.validate.status.error = false;
            this.update.validate.status.rule = []
            this.update.validate.role.error = false;
            this.update.validate.role.rule = []
            this.update.validate.motive.error = false;
            this.update.validate.motive.rule = []
        }
    },
    computed :{
        ...mapState('auth',['token','userDB']),
        emptyEdit(){
            if(this.update.Vstatus === '' || this.update.Vstatus === null || this.update.Vrole === '' || this.update.Vrole === null || this.update.Vmotive === null || this.update.Vmotive === ''){
                return true
            }else{return false}
        },
        isAdmin(){
            if(this.userDB.role === 'administrador'){
                return true;
            }else{return false}
        }
    },

}
</script>

