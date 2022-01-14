<template>
  <div>
    <v-simple-table  >
                  <thead>
                    <tr >
                      <th v-for="(column,index) in table.columns" :key="index" >
                        <span class="text-md-body-1" > {{column.text}}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,index) in table.dataResponse" :key="index" >
                      <td>
                        {{row.name}}
                      </td>
                      <td>
                        <v-icon>
                          {{row.icon}}
                        </v-icon>
                      </td>
                      <td>
                       <div class="my-1 d-flex flex-row">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-1" @click="deleted(row)" dark elevation="1" fab x-small v-bind="attrs" v-on="on" :hover="false" color="grey lighten-3">
                                        <v-icon color="grey lighten-1">
                                            mdi-trash-can-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>Eliminar</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-1" @click="edit(row)" dark elevation="1" fab  x-small v-bind="attrs" v-on="on" color="grey lighten-3">
                                        <v-icon color="grey lighten-1">
                                            mdi-pencil
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>Editar</span>
                            </v-tooltip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
    </v-simple-table>

    <template v-if="table.loading">
              <div class="mx-2">
                <v-progress-linear color="info" indeterminate ></v-progress-linear>
              </div>
    </template>
    <template>
        <div class="mx-2" >
            <v-pagination
                    color="info"
                    v-model="table.pagination.current_page"
                    class="my-4"
                    :length="table.pagination.last_page"
                    @input="paginate"
            ></v-pagination>
        </div> 
    </template>


  </div>
</template>

<script>
import axiosInstance from '@/services/api/axiosInstance'
import {mapState} from 'vuex'
export default {
  props:{
    table : {
      type : Object
    },
    url : {
      type : String
    }
  },
  methods : {
     paginate(){
            this.table.loading = true
            axiosInstance.get(this.url+'?page='+this.table.pagination.current_page,{
                params : {
                    token : this.token,
                    module : this.table.module
                }
            })
            .then(res => {
                 if(res.error){
                     this.table.dataResponse = []
                     this.table.loading = false
                     const snackbar = {display:true,text:'No hay categorias',timeout:2800,color:'error'}
                     this.$emit("setSnackbar", snackbar)
                     return
                 }
                this.table.dataResponse= res.data.data
                this.table.loading = false
            })
            .catch(err => {
                const snackbar = {display:true,text:err,timeout:3500,color:'error'}
                this.$emit("setSnackbar", snackbar)
                this.table.loading = false
            })

     },
     deleted(item){
       this.$emit("setDialogSmallScreen",true)
       this.$emit("setCategory",item)
     },
     edit(item){
       this.$emit("setDialogFullScreen",true)
       this.$emit("setCategory",item)
      
     }

  },computed :{
        ...mapState('auth',['token']),
  },

}
</script>

<style>

</style>