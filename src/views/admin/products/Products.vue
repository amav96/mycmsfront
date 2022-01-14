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
           <div class="my-2 mx-2 mobile ">
                <div class="my-1" >
                    <v-breadcrumbs class="pa-0"  :items="linkFollowed">
                        <template v-slot:divider>
                            <v-icon>mdi-chevron-right</v-icon>
                        </template>
                    </v-breadcrumbs>
                </div>
                <div class="my-1 d-flex  justify-center flex-row ">
                     <div class="mx-1" >
                            <v-btn
                            rounded
                            color="blue lighten-5"
                            class="info--text"
                            @click="openSave()"
                            >
                            Publicar
                              <v-icon right>
                                  mdi-plus
                              </v-icon>
                            </v-btn>
                      </div>
                      <div class="mx-1" >
                           <Menu
                          :section="getProducts"
                          :resources="RESOURCES"
                          @setError="RESOURCES.error.alert = $event"
                          @setGlobalParameters="RESOURCES.api.globalParameters = $event"
                          @deleteProperty="deleteProperty($event)"
                          @cleanFilter="cleanFilter($event)"
                          @setLastPage="RESOURCES.pagination.last_page = $event"
                          @setCurrentPage="RESOURCES.pagination.current_page = $event"
                          @setResponse="RESOURCES.data.response = $event"
                          @deleteParameter="RESOURCES.api.deleteParameter = $event"
                          @setLoading="RESOURCES.loaders.linear = $event"
                          />
                      </div>
                </div>
                
          </div>

          <template v-if="showFilter">
            <div class="mx-2 mt-1">
              <Filtering
                :resources="RESOURCES"
                @setError="RESOURCES.error.alert = $event"
                @setGlobalParameters="RESOURCES.api.globalParameters = $event"
                @deleteProperty="deleteProperty($event)"
                @setLastPage="RESOURCES.pagination.last_page = $event"
                @setCurrentPage="RESOURCES.pagination.current_page = $event"
                @setResponse="RESOURCES.data.response = $event"
                @setUrlCurrent="RESOURCES.url.current = $event"
                @updateData="updateData($event)"
                ref="refFilter"
              />
            </div>
          </template>

          <template v-if="RESOURCES.error.alert.display">
            <v-alert border="right" colored-border type="error" elevation="2" class="mt-0 mb-3 mx-2">
              <template v-if="RESOURCES.error.alert.filter">
                {{ RESOURCES.error.alert.text }} para <strong>({{RESOURCES.error.alert.slug}}).</strong>
              </template>
              <template v-else>
                  {{ RESOURCES.error.alert.text }}
              </template>
            </v-alert>
          </template>

           <template v-if="RESOURCES.loaders.linear">
            <div class="mx-2">
              <!-- <v-progress-linear color="info" indeterminate></v-progress-linear> -->
               <v-overlay  color="white"
             >
                      <v-progress-circular
                        indeterminate
                        size="64"
                        color="info"
                      ></v-progress-circular>
                  </v-overlay>
            </div>
          </template>

          <template v-if="RESOURCES.data.response.length > 0" >
              <CardListProduct 
              :token="token"
              :resources="RESOURCES"
              :response="RESOURCES.data.response"
              @openUpdateProduct="openUpdate($event)"
              @openDeleteProduct="openDelete($event)"
              @openPause="openPause($event)"
              @openActive="openActive($event)"
              @openRestore="openRestore($event)"
              @setLoading="RESOURCES.loaders.linear = $event"
              ref="setCardList"
              />
          </template>
            <!-- dialog -->
            <template v-if="DialogFullScreen.display" >
                <DialogFullScreen  :DialogFullScreen="DialogFullScreen">
                  <template v-if="saveProduct.display">
                      <SaveProduct
                      :userDB="userDB"
                      :token="token"
                      :saveProduct="saveProduct"
                      @getProducts="_getProducts($event)"
                      @setDialog="DialogFullScreen.display = $event"
                      @setSnackbar="RESOURCES.snackbar = $event"
                      />
                  </template>
                  <template v-if="updateProduct.display">
                      <UpdateProduct
                      :userDB="userDB"
                      :token="token"
                      :updateProduct="updateProduct"
                      @setDialog="DialogFullScreen.display = $event"
                      @setSnackbar="RESOURCES.snackbar = $event"
                      @reloadPaginate="updateData($event)"
                      />
                  </template>
                </DialogFullScreen>

            </template >
            
            <template v-if="pauseProduct.display || deleteProduct.display || activeProduct.display || restoreProduct.display">
              <DialogSmallScreen :DialogSmallScreen="DialogSmallScreen" >
                  <template v-if="deleteProduct.display">
                    <Confirm 
                      :content="deleteProduct"
                      @setContinue="_confirmDelete($event)"
                    />
                  </template>
                  <template v-if="pauseProduct.display">
                    <PauseProduct 
                    :pauseProduct="pauseProduct"
                    @closeContinue="pauseProduct.display = $event"
                    @setLoading ="RESOURCES.loading = $event"
                    @setMsg ="RESOURCES.snackbar = $event"
                    @updateData="updateData($event)"
                     />
                  </template>
                   <template v-if="activeProduct.display">
                    <ActiveProduct 
                    :activeProduct="activeProduct"
                    @closeContinue="activeProduct.display = $event"
                    @setLoading ="RESOURCES.loading = $event"
                    @setMsg ="RESOURCES.snackbar = $event"
                    @updateData="updateData($event)"
                     />
                  </template>
                  <template v-if="restoreProduct.display">
                    <RestoreProduct 
                    :restoreProduct="restoreProduct"
                    @closeContinue="restoreProduct.display = $event"
                    @setLoading ="RESOURCES.loading = $event"
                    @setMsg ="RESOURCES.snackbar = $event"
                    @updateData="updateData($event)"
                     />
                  </template>
                 
              </DialogSmallScreen>
               
            </template>

          <template v-if="showPaginate" >
              <div v-show="this.RESOURCES.data.response.length > 0">
                <Pagination 
                  :token="token"
                  :resources="RESOURCES"
                  @setError="RESOURCES.snackbar = $event"
                  @setErrorInfo="RESOURCES.error.alert = $event"
                  @setLastPage="RESOURCES.pagination.last_page = $event"
                  @setCurrentPage="RESOURCES.pagination.current_page = $event"
                  @setResponse="RESOURCES.data.response = $event"
                  @setLoading="RESOURCES.loaders.linear = $event"
                  ref="refPagination"
                />
              </div>
          </template>
          
        <Snackbar :snackbar="RESOURCES.snackbar" />
       
      </v-container>

   </v-app>
</template>

<script>
  import AppBar from '@/components/core/AppBar'
  import DrawerAdmin from '@/components/core/DrawerAdmin'
  import Snackbar from '@/components/message/Snackbar'
  import SaveProduct from '@/components/form/custom/admin/products/SaveProduct'
  import UpdateProduct from '@/components/form/custom/admin/products/UpdateProduct'
  import PauseProduct from '@/components/form/custom/admin/products/PauseProduct'
  import ActiveProduct from '@/components/form/custom/admin/products/ActiveProduct'
  import RestoreProduct from '@/components/form/custom/admin/products/RestoreProduct'
  import DialogFullScreen from '@/components/dialog/reusable/DialogFullScreen'
  import DialogSmallScreen from '@/components/dialog/reusable/DialogSmallScreen'
  import CardListProduct from '@/components/card/reusable/CardListProduct'
  import Menu from "@/components/menu/reusable/Menu";
  import Filtering from "@/components/form/reusable/inputs/Filtering";
  import Pagination from '@/components/tables/reusable/pagination/Pagination'
  import Confirm from '@/components/form/reusable/forms/Confirm'
  import {mapState} from 'vuex'
  import axiosInstance from '@/services/api/axiosInstance'
  

  export default {
    components:{
      AppBar,DrawerAdmin,Snackbar,SaveProduct,UpdateProduct,PauseProduct,ActiveProduct,RestoreProduct,
      DialogFullScreen,DialogSmallScreen,CardListProduct,Menu,Filtering,Pagination,Confirm
    },
    data () {
      return {
          linkFollowed: [
            {
              text: 'Ventas',
              disabled: false,
              href: '',
            },
            {
              text: 'Productos',
              disabled: false,
              href: '',
            },
          ],
          DialogFullScreen:{
            display: false,
            title: ''
          },
          DialogSmallScreen:{
            display: false,
          },
          saveProduct:{
            display: false,
            url:'/products'
          },
          updateProduct:{
            display: false,
            url:'/products/update',
            data:[],
          },
          pauseProduct:{
            display: false,
            url:'/products/pause',
            title: '¿Estas seguro de pausar este producto?',
            accept: {
                title: 'Pausar',
                color: 'success'
            },
            exit: {
                title: 'Atras',
                color: 'error'
            },
            data:[],
          },
          deleteProduct:{
            display: false,
            url:'/products/delete',
            title: '¿Estas seguro de eliminar este producto?',
            accept: {
                title: 'Eliminar',
                color: 'success'
            },
            exit: {
                title: 'Atras',
                color: 'error'
            },
            data:[]
          },
          activeProduct:{
            display: false,
            url:'/products/active',
            title: '¿Estas seguro de activar este producto?',
            accept: {
                title: 'Activar',
                color: 'success'
            },
            exit: {
                title: 'Atras',
                color: 'error'
            },
            data:[]
          },
          restoreProduct:{
            display: false,
            url:'/products/restore',
            title: '¿Estas seguro de restaurar este producto?',
            accept: {
                title: 'Restaurar',
                color: 'success'
            },
            exit: {
                title: 'Atras',
                color: 'error'
            },
            data:[]
          },
          product:{
            display: true,
            pagination: {
              display: true,
              current_page: 0,
              last_page: 0,
              limit: 7,
            },
            filter: {
              display: true,
              dense: false,
              outline: false,
              solo: true,
              clearable: true,
              label: "Buscar",
              color: "info",
              url: "/products/filter",
            },
            select: {
              url: "",
            },
            table: {
              display: false,
              columns: [
                { text: "id" },
                { text: "Nombre" },
                { text: "Apellido" },
                { text: "Documento" },
                { text: "Email" },
                { text: "Rol" },
                { text: "Estado" },
                { text: "Fecha" },
                { text: "Ult Actualzaciòn" },
                { text: "Acciòn" },
              ],
            },
             menu: {
              color: "light-blue",
              iconLeft: true,
              iconRight: false,
              icon: "mdi-filter",
              title: "Estado",
              options: [
                { title: "Modificar", method:'updateProduct' },
                { title: "Eliminar" , method:'deleteProduct' },
                { title: "Pausar" , method:'pauseProduct' },
                { title: "Activar" , method:'activeProduct' },
                { title: "Restaurar" , method:'restoreProduct' },
                { title: "Ver publicacion" },
              ],
              property: "status",
              url: "/users",
            },
            url: {
              current: "/products",
            },
          },
          getProducts:{
             display: true,
             menu: {
              color: "light-blue",
              iconLeft: true,
              iconRight: false,
              icon: "mdi-filter",
              title: "Filtro",
              options: [
                { title: "Todos",icon:'mdi-notification-clear-all',  method: "_getData", value:'all' },
                { title: "Activos",icon:'mdi-cart-arrow-right',  method: "_getData", value:'active' }, 
                { title: "Pausados",icon:'mdi-motion-pause',  method: "_getData" , value:'pause' },
                { title: "Sin stock",icon:'mdi-package-variant',  method: "_getData" , value: 'outstock' },
                { title: "Eliminados",icon:'mdi-close-box-multiple-outline',  method: "_getData" , value:'eliminated' },
              ],
              property: "status",
              url: "/products",
            },
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
          absolute:true,
          overlay: false
      }
    },
    methods: {
      openSave(){
        this.DialogFullScreen.display = true
        this.DialogFullScreen.title = 'Publicar producto'
        this.$nextTick(()=>{
          this.updateProduct.display =  false
          this.saveProduct.display =  true
        })
        
       
      },
      openUpdate(data){
      
        this.DialogFullScreen.display = true
        this.DialogFullScreen.title = 'Actualizar producto'
         this.$nextTick(()=>{
           this.saveProduct.display =  false
           this.updateProduct.display =  true
           this.updateProduct.data =  data
          })
      },
      openDelete(data){
          this.DialogSmallScreen.display = true
          this.deleteProduct.data = data
          this.deleteProduct.display = true
      },
      openPause(data){
          this.DialogSmallScreen.display = true
          this.pauseProduct.data = data
          this.pauseProduct.display = true
      },
      openActive(data){
          this.DialogSmallScreen.display = true
          this.activeProduct.data = data
          this.activeProduct.display = true
      },
      openRestore(data){
          this.DialogSmallScreen.display = true
          this.restoreProduct.data = data
          this.restoreProduct.display = true
      },
      async _getProducts(){
        
        const url = this.product.url.current;
        this.RESOURCES.loaders.linear = true;
        var dataRequest = { limit: this.product.pagination.limit, status: 'all' };
        this.RESOURCES.api.globalParameters = dataRequest;
          
            await  axiosInstance.get(url, {
                params: {
                  token: this.token,
                  dataRequest: dataRequest,
                },
              })
              .then((res) => {
                this.RESOURCES.loaders.linear = false;
                if (res.data.error === "Unauthenticated") {
                  return this.$router.push("/");
                }
                if (res.data.error) {
                  const snackbar = {display:true,text:res.data.error,timeout:5000,color:'error'}
                  this.RESOURCES.snackbar = snackbar
                  this.RESOURCES.data.response = [];
                  this.RESOURCES.table.display = false;
                  return;
                }
                if(res.data.data.length < 1){
                  const snackbar = {display:true,text:'No hay resultados para mostrar',timeout:5000,color:'error'}
                  this.RESOURCES.snackbar = snackbar
                  return
                }
                this.RESOURCES.pagination.last_page = res.data.last_page;
                this.RESOURCES.data.response = res.data.data;
                this.RESOURCES.table.display = true;
              })
              .catch((err) => {
                this.RESOURCES.loaders.linear = false;
                console.log(err);
              });
      },
      updateData() {
        this.$refs.refPagination.paginate();
      },
      _confirmDelete(flag){
        if(flag){
          this.deleteProduct.display = false
          this.RESOURCES.loading = true
          const url = this.deleteProduct.url
          axiosInstance.delete(url,{
              params:{
                 token:this.token,
                  id:this.deleteProduct.data.id,
              }
  
          })
          .then(res => {
            this.RESOURCES.loading = false
            if(res.data.error){
                const snackbar = {display:true,text:res.data.error,timeout:5000,color:'error'}
                this.RESOURCES.snackbar = snackbar
                return
            }

                const snackbar = {display:true,text:'Eliminado correctamente',timeout:5000,color:'success'}
                this.RESOURCES.snackbar = snackbar
                this.updateData()

          })
          .catch(err => {
            console.log(err)
          })
         
        }else{
          this.deleteProduct.display = false
        }
      },
      assignSection() {
        Object.assign(this.RESOURCES, this.product);
      },
      deleteProperty(property) {
      this.$delete(this.RESOURCES.api.globalParameters, property);
      },
      cleanFilter(){
        this.$refs.refFilter.cleanFilter();
        
      },
      test(){
        console.log("hola")
        alert("he")
      }
    },
    computed :{
        ...mapState('auth',['token','userDB','loadingBetweenRoutes','loadingGlobal']),
        showPaginate() {
          if (
            this.RESOURCES.table.display &&
            this.RESOURCES.pagination.display &&
            this.RESOURCES.data.response.length > 0 ||
            this.showFilter
          ) {
            return true;
          } else {
            return false;
          }
        },
         showFilter(){
          if (this.RESOURCES.filter.display) {
            return true;
          } else { return false;}
        }
    },
    created() {
    this.assignSection();
      this.$nextTick(() => {
        this._getProducts();
      });

      
  },
  }
</script>

<style >

.mobile{
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    flex-wrap: wrap;
}

</style>