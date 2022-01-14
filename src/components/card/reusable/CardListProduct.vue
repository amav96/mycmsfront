<template>
    <div  >
         <CoolLightBox 
        :items="ItemsImage" 
        :index="index"
        @close="index = null"> 
        </CoolLightBox>  
        
         <div class="main-card" >
            <template v-if="sortGallery && sortGallery.length > 0">
                <div :class="classStatusProduct(item)" 
                v-for="(item,index) in sortGallery"
                :key="index"
                >
                    <div class="avatar" >
                        <template v-if="item.gallery && item.gallery.length > 0" >
                            <img class="inImg" @click="showLightBox(item)"  :src="image(item)">
                        </template>
                    </div>

                    <div class="content-text " >
                        <div class="info-text" >
                            <template v-if="item.in_discount>0" >
                                <div class="ofert" >
                                   <v-chip x-small class="success" > % {{item.discount}} OFF</v-chip>                                   
                                </div>
                                
                            </template>
                            <div class="info-title" >
                                {{item.name}}
                            </div>

                             <div class="info-text light mt-1" >
                          
                                <div>
                                     $ {{item.price }} &nbsp; 
                                     <template v-if="item.inventory === 0">
                                        <v-chip x-small class="error" > Sin stock</v-chip>
                                     </template>
                                     <template v-else-if="item.inventory === 1">
                                        x {{item.inventory}} unidad
                                     </template>
                                     <template v-else>
                                        x {{item.inventory}} unidades
                                     </template>
                                      
                                </div>
                           
                            
                            </div>
                            
                        </div>
                        <div class="divisor" >
                            <hr style="height: 1px;border: none;color: rgb(222 222 222);background-color: rgb(222 222 222);" >
                        </div>
                       

                        <div class="info-text light" >
                            <div>
                                {{item.code}} 
                            </div>
                        </div>

                        <template v-if="item.status !== 2">
                            <div class="info-text light" >
                                <div>
                                    {{item.category.name}} 
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="info-text light" >
                                <div>
                                    <strong>{{showStatusProduct(item.status)}} </strong>
                                </div>
                            </div>
                        </template>
                        


                         <div class="info-text menu" >
                            <div>
                               <v-menu
                                bottom
                                origin="center center"
                                transition="scale-transition"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                    
                                    v-bind="attrs"
                                    v-on="on"
                                    >
                                    mdi-dots-vertical
                                    </v-icon>
                                </template>
                                    <v-list>
                                        <div v-for="(menu, i) in resources.menu.options"
                                        :key="i" @click="methodsMenu(menu.method,item)">
                                            <template v-if="item.status === 2">
                                                <template v-if="item.deleted_at !== null">
                                                    <template v-if="menu.method !== 'pauseProduct'  && menu.method !== 'updateProduct' && menu.method !== 'activeProduct' && menu.method !== 'deleteProduct'">
                                                        <v-list-item  class="hover-list">
                                                                <v-list-item-title    >{{ menu.title }}</v-list-item-title>
                                                        </v-list-item>
                                                    </template>
                                                </template>
                                                <template v-else>
                                                    
                                                    <template v-if="menu.method !== 'pauseProduct' && menu.method !== 'restoreProduct' && menu.method !== 'updateProduct'">
                                                        <v-list-item  class="hover-list">
                                                                <v-list-item-title    >{{ menu.title }}</v-list-item-title>
                                                        </v-list-item>
                                                    </template>
                                                </template>
                                            </template>
                                            <template v-else >
                                                <template v-if="item.deleted_at !== null">
                                                        <template v-if="menu.method !== 'pauseProduct' && menu.method !== 'updateProduct' && menu.method !== 'deleteProduct' && menu.method !== 'activeProduct'">
                                                            <v-list-item   class="hover-list">
                                                                    <v-list-item-title   >{{ menu.title }}</v-list-item-title>
                                                            </v-list-item>
                                                        </template>
                                                </template>
                                                <template v-else>
                                                    <template v-if="menu.method !== 'activeProduct' && menu.method !== 'restoreProduct'">
                                                        <v-list-item   class="hover-list">
                                                                <v-list-item-title   >{{ menu.title }}</v-list-item-title>
                                                        </v-list-item>
                                                    </template>
                                                </template> 
                                            </template>
                                        </div>
                                    </v-list>
                                </v-menu>
                            </div>
                        </div>
                    </div>
                    <div class="menu-mobile" >
                        <v-menu
                        bottom
                        origin="center center"
                        transition="scale-transition"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            v-bind="attrs"
                            v-on="on"
                            >
                            mdi-dots-vertical
                            </v-icon>
                        </template>
                        <v-list>
                            <div v-for="(menu, i) in resources.menu.options"
                            :key="i" @click="methodsMenu(menu.method,item)">
                                <template v-if="item.status === 2">
                                     <template v-if="item.deleted_at !== null">
                                        <template v-if="menu.method !== 'pauseProduct'  && menu.method !== 'updateProduct' && menu.method !== 'activeProduct' && menu.method !== 'deleteProduct'">
                                            <v-list-item  class="hover-list">
                                                    <v-list-item-title    >{{ menu.title }}</v-list-item-title>
                                            </v-list-item>
                                        </template>
                                     </template>
                                     <template v-else>
                                        
                                        <template v-if="menu.method !== 'pauseProduct' && menu.method !== 'restoreProduct' && menu.method !== 'updateProduct'">
                                            <v-list-item  class="hover-list">
                                                    <v-list-item-title    >{{ menu.title }}</v-list-item-title>
                                            </v-list-item>
                                        </template>
                                    </template>
                                </template>
                                <template v-else >
                                    <template v-if="item.deleted_at !== null">
                                            <template v-if="menu.method !== 'pauseProduct' && menu.method !== 'updateProduct' && menu.method !== 'deleteProduct' && menu.method !== 'activeProduct'">
                                                <v-list-item   class="hover-list">
                                                        <v-list-item-title   >{{ menu.title }}</v-list-item-title>
                                                </v-list-item>
                                            </template>
                                    </template>
                                    <template v-else>
                                        <template v-if="menu.method !== 'activeProduct' && menu.method !== 'restoreProduct'">
                                            <v-list-item   class="hover-list">
                                                    <v-list-item-title   >{{ menu.title }}</v-list-item-title>
                                            </v-list-item>
                                        </template>
                                    </template> 
                                </template>
                            </div>
                        </v-list>
                        </v-menu>
                    </div>
                </div>
            </template>
        </div> 
    
    </div>
  
</template>


<script>
import {mapActions} from 'vuex'
import product from '@/helpers/Products/functions'
import {baseUrl} from '@/services/api/BaseUrl'
export default {
    props:['resources','token','response'],
    computed:{
        sortGallery(){
            this.sortImg = []
            const sortImg = this.resources.data.response
               sortImg.forEach((val)=>{
                   
                   val.gallery.sort((o1,o2)=>{
                       if(o1.position < o2.position){
                           return -1;
                       } else if(o1.position > o2.position){
                           return 1;
                       } else {
                           return 0
                       }
                   })
               })
              this.sortImg = sortImg
              return sortImg
        }
    },
    data(){
        return {
            ItemsImage:[],
            imagesSorted:[],
            internalResponse:[],
            index: null,
            sortImg:[]
        }
    },
    methods: {
         ...mapActions('auth',['loadingAuthenticate']),
         showProductSmall(){
             if(this.$vuetify.breakpoint.width<620){
                 alert("fuimos a verlo")
             }
         },
         image(item){
             
             var file_path = item.gallery[0].file_path;
             var file_name = item.gallery[0].file_name;
             var url =baseUrl().cms +'uploads/products/'+file_path+'/t_'+file_name;
             return  url
         },
         showLightBox(item){
             
             this.ItemsImage = []
             item.gallery.forEach((val) =>{
                 var url =baseUrl().cms +'uploads/products/'+val.file_path+'/'+val.file_name;
                 this.ItemsImage.push(url)
             })
             this.index = 0
             // this.index = 1
         },
         updateProduct(data){
            this.$emit("openUpdateProduct",data)
         },
         deleteProduct(data){
             this.$emit("openDeleteProduct",data)
         },
         pauseProduct(data){
             this.$emit('openPause',data);
         },
         activeProduct(data){
             this.$emit('openActive',data);
         },
         restoreProduct(data){
             this.$emit('openRestore',data);
         },
         methodsMenu(method,data = ''){
             this[method](data)   
         },
         handlerSortingImages(val){
             if(val && val.length>0){
                this.$emit("setLoading", false)
             }
         },
         showStatusProduct(value){
             return product.showStatusProduct(value)
         },
         classStatusProduct(item){
             if(item.deleted_at !== null){
                return 'card-custom red lighten-4'
             }
             if(item.status === 2){
                 return 'card-custom grey lighten-2'
             }
             if(item.status === 1){
                return 'card-custom'
             }

             
             
         }
    },
    watch: {
        sortImg(val){
            this.handlerSortingImages(val)
        }
    },
   
}
</script>

<style scoped >

    .main-card{
        display: flex;
        justify-content:center;
        flex-direction: column;
        flex-wrap:wrap;
    
    
    }
    .card-custom{
        background: white;
        padding: 8px;
        height:10rem;
        display: flex;
        justify-content: center;
        flex-direction: row;
        border: thin solid rgba(0, 0, 0, 0.12);
        cursor: pointer;
        
    } 
  
    
    .avatar{
        background-color: #f5f5f5;
            min-width: 88px;
            max-width: 88px;
            height: 80px;
            border-radius: 4px;
            margin-right: 24px;
            display: -webkit-flex;
            display: flex;
            -webkit-flex-wrap: wrap;
            flex-wrap: wrap;
            -webkit-align-items: flex-start;
            align-items: flex-start;
            -webkit-justify-content: space-between;
            justify-content: space-between;
            overflow: hidden;
            padding: 8px;
            position: relative;
    }
    .inImg{
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        mix-blend-mode: multiply;
    }

    .content-text{
        display: flex;
        justify-content:center;
        align-content: center;
        flex-direction: column;
        margin: 0px 5px;
        width: 100%;
    
    }

    .divisor{
        display: block;
        margin: 8px 0px;
       
    }
    .menu{
    display: none;
    }
    .light{
    color: rgb(104, 99, 99);
    }
    .info-text{
    margin: 0px 10px;

    margin: 0.3px 0px;
    font-size:14px;
    }
    .info-content{
        color: rgb(128, 123, 123);
    }
    .menu-mobile{
        display:block;
    }



    @media (min-width: 600px){
        
        .card-custom{
            cursor:default;
        } 
        .content-text{
            margin: 0px 10px;
            flex-direction: row;
            justify-content:space-around;
            align-items: center;
        }
        .divisor{
            display: none;
        }
        .info-text{
            display: flex;
            justify-content:center;
            flex-direction: column;
            width:6rem;
        
        }
    
        .menu{
            display: block;
        } 
        .hover-list:hover{
            transition:0.3s;
            background:rgb(204, 195, 195) !important;
            cursor: pointer;
        }
        .ofert{
            position: relative;
            top: -10px !important;
        } 

        .menu-mobile{
            display:none;
        }

        
        
    } 

    @media (min-width: 960px){
        .info-text{
        
            width:5rem;

            }
        } 
    @media (min-width: 1024px){
    .info-text{
        width:7rem;

        }
    } 

    @media (min-width: 1264px){
        .info-text{
            
            width:9rem;
            
        }
    } 



        

</style>


