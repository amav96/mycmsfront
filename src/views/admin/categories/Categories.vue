<template>
   <v-app class="app" >
     <!-- menu -->
      <DrawerAdmin/>
       <v-container>

  
           <div class="my-6 mx-2 mobile">
                <div class="my-1" >
                    <v-breadcrumbs class="pa-0"  :items="linkFollowed">
                        <template v-slot:divider>
                            <v-icon>mdi-chevron-right</v-icon>
                        </template>
                    </v-breadcrumbs>
                </div>
           </div>
          <div class="my-2 mt-8 mx-2">
            <v-row>
              <v-col cols="12"  lg="4" md="4" sm="6">
                <AddCategory
                :token="token"
                :url="url"
                @callGetCategories="_getCategories($event)"
                @setSnackbar="snackbar = $event"
                />
              </v-col>
              
              <template v-if="table && table.dataResponse.length>0">

                <v-col class="margin-8" cols="12" lg="8" md="6" sm="6">
                  <Tabs 
                    :url="url.getModules"
                    @selected="$_selected($event)"
                   />
                  <TableCategory
                  :table="table"
                  :url="url.getCategories"
                  :snackbar="snackbar"
                  @setSnackbar="snackbar = $event"
                  @setDialogFullScreen ="DialogFullScreen.display = $event"
                  @setDialogSmallScreen ="DialogSmallScreen.display = $event"
                  @setCategory ="category = $event"
                  />
                </v-col>
              </template>
              
            </v-row>
          </div>
        <!-- DIALOG -->
        <DialogFullScreen v-if="DialogFullScreen.display" :DialogFullScreen="DialogFullScreen">
          <UpdateCategory
          :snackbar="snackbar"
          :category="category" 
          :token="token"
          :url="url"
          :DialogFullScreen="DialogFullScreen"
          @setSnackbar="snackbar = $event"
          @_getCategories="_getCategories($event)"
          />
        </DialogFullScreen>

        <DialogSmallScreen v-if="DialogSmallScreen.display" :DialogSmallScreen="DialogSmallScreen">
        <DeleteCategory
        :snackbar="snackbar"
        :category="category" 
        :token="token"
        :url="url"
        :DialogSmallScreen="DialogSmallScreen"
        @setSnackbar="snackbar = $event"
        @_getCategories="_getCategories($event)"
        />
        </DialogSmallScreen>

        <Snackbar :snackbar="snackbar" />
        </v-container>


   </v-app>

</template>

<script>
  import AppBar from '@/components/core/AppBar'
  import DrawerAdmin from '@/components/core/DrawerAdmin'
  import TableCategory from '@/components/tables/custom/TableCategory'
  import AddCategory from '@/components/form/custom/admin/categories/AddCategory'
  import UpdateCategory from '@/components/form/custom/admin/categories/UpdateCategory'
  import DeleteCategory from '@/components/form/custom/admin/categories/DeleteCategory'
  import Snackbar from '@/components/message/Snackbar'
  import Tabs from '@/components/tabs/reusable/Tabs'
  import DialogFullScreen from '@/components/dialog/reusable/DialogFullScreen'
  import DialogSmallScreen from '@/components/dialog/reusable/DialogSmallScreen'
  import axiosInstance from '@/services/api/axiosInstance'
  import {mapState} from 'vuex'

  export default {
    components:{
      AppBar,
      DrawerAdmin,
      TableCategory,
      AddCategory,
      UpdateCategory,
      DeleteCategory,
      Snackbar,
      Tabs,
      DialogFullScreen,
      DialogSmallScreen
    },
    data () {
      return {
          linkFollowed: [
           
            {
              text: 'Categorias',
              disabled: false,
              href: '',
            },
          ],
          url:{
            saveCategory: '/category/add',
            updateCategory: '/category/edit',
            deleteCategory: '/category/delete',
            getCategories:'/category/categories',
            getModules: '/category/modules',
          },
          snackbar:{
            display:false,
            text:'',
            timeout:-1,
            color:''
          },
          table: {
            display:true,
            loading:false,
            dataResponse:[],
            columns:[
                {text:'Nombre'},
                {text:'Icono'},
                {text:''},
            ],
            pagination : {
              current_page : 1,
              last_page : 0
            },
            module: 2, //Este modulo default es para mostrarlo en la tabla
          },
          DialogFullScreen:{
            display: false,
            title: 'Editar categoria'
          },
          DialogSmallScreen:{
            display: false,
            title: '¿Estas seguro?'
          },
          category : {
            id: '',
            name:'',
            module: '',
          },
      }
    },
    methods:{
      async  _getCategories(){
         await axiosInstance.get(this.url.getCategories,{
           params: {
             token: this.token,
             module:this.table.module
           }
         })
              .then(res => {
                if(!res){
                  const snackbar = {display:true,text:'No hay categorias',timeout:2800,color:'error'}
                  this.snackbar = snackbar
                  
                  return 
                }
                   this.table.pagination.last_page = res.data.last_page
                   this.table.dataResponse = res.data.data
              })
              .catch(err => {
                console.log(err)
              })
        },
        $_selected(item){
          this.table.module = item.id
          
          this._getCategories()
        }
    },
     created(){
     this._getCategories();
     
    },
    computed :{
        ...mapState('auth',['token']),
    },
  
  }
</script>
