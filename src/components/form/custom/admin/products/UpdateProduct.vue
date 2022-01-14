<template>
  <div>
      <v-container >
            <v-overlay v-if="overlay" color="white" >
                <v-progress-circular
                indeterminate
                size="64"
                color="info"
                ></v-progress-circular>
            </v-overlay>

            <v-row class=" py-4 d-flex justify-start flex-column" >
                <v-col  cols="12" lg="12" md="12" xs="12" >
                    <GalleryImageUpdate
                        :imageData="gallery.imageData"
                        @setImageData="setGallery($event)"
                        @setDeleteImageData="gallery.imageData =  $event"
                        @DeletedImagesServer="deletedImagesServer = $event"
                        @setDraggable="gallery.imageData =  $event"
                    />
                </v-col>
                <v-col>
                    <v-row class="d-flex justify-start flex-row">
                        <v-col  cols="12" lg="4" sm="6" md="6" xs="12" >
                            <v-text-field
                            v-model="updateData.name"
                            class="mx-2"
                            color="info"
                            label="Nombre del producto"
                            :hint="largeName"
                            ref="name"
                            rows="2"
                            />
                        </v-col>

                        <v-col  cols="12" lg="4" sm="6" md="6" xs="12" >
                            <v-text-field
                            v-model="updateData.code"
                            class="mx-2"
                            color="info"
                            label="Codigo del producto"
                            
                            />
                        </v-col>

                        <v-col  cols="12" lg="4" sm="6" md="6" xs="12" >
                            <CompleteSearch
                            :searchID="categoryProducts"
                            title="Categoria" 
                            :url="url.getCategories"
                            :token="token"
                            :customClass="customClass.select"
                            :reassign="updateProduct.data.category_id"
                            @exportVal="setCategory($event)" 
                            />
                        </v-col>

                        <v-col  cols="12" lg="4" sm="6" md="6" xs="12" >
                            <v-text-field
                            v-model="updateData.price"
                            class="mx-2"
                            color="info"
                            label="Precio"
                            type="number"
                           
                            />
                        </v-col>

                         <v-col  cols="12" lg="4" sm="6" md="6" xs="12" >
                            <v-text-field
                            v-model="updateData.inventory"
                            class="mx-2"
                            color="info"
                            label="Stock"
                            type="number"
                          
                            />
                        </v-col>

                        <v-col  cols="12" lg="4" sm="6" md="6" xs="12" >
                            <v-select
                            v-model="updateData.in_discount"
                            class="mx-2"
                            color="info"
                            label="¿En descuento?"
                            :items="inDiscountItems"
                            item-text="text"
                            item-value="value"
                            
                            >
                            </v-select>
                        </v-col>

                        <template v-if="updateProduct.data.in_discount === 1 || updateData.in_discount === 1">
                            <v-col  cols="12" lg="4" md="12" xs="12" >
                                <v-text-field
                                v-model="updateData.discount"
                                class="mx-2"
                                color="info"
                                type="number"
                                label="Descuento"
                                />
                            </v-col>
                        </template>
                                           
                        <v-col  cols="12" lg="6" md="6" xs="6" >
                            <v-textarea
                             v-model="updateData.content"
                            label="Descripciòn del producto"
                            class="mx-2"
                            color="info"
                            rows="1"
                            row-height="20"
                            ></v-textarea>
                        </v-col>
              
                    </v-row>
                </v-col>
                 <v-col class="mx-auto px-6" cols="12" lg="6" xs="6"  >
                    <v-btn  block color="success" @click="_updateProduct()" class="py-6" rounded  >
                        Guardar cambios
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
  </div>
</template>

<script>
import GalleryImageUpdate from '@/components/form/reusable/forms/GalleryImageUpdate'
import CompleteSearch from '@/components/form/reusable/select/CompleteSearch'
import axiosInstance from '@/services/api/axiosInstance'
import {baseUrl} from '@/services/api/BaseUrl'
export default {
    components:{
        CompleteSearch,
        GalleryImageUpdate
    },
    props:['userDB','token','updateProduct'],
    data(){
        return {
            url:{
                getCategories:'/products/categories',
            },
            categoryProducts : '2',
            customClass:{
                select: {
                    color: 'info',
                    class: 'mx-2',
                    outlined: false,
                    dense:false
                }
            },
            inDiscountItems:[
                {text:"Si", value:1},
                {text:"No", value:0}
            ],
            overlay : false,
            ItemsImage:[],
            index: null,
            updateData:{
                name : '',
                 code: '',
                price : '',
                inventory:'',
                in_discount : '',
                discount : '',
                content : '',
                image: [],
                category_id: '',
               
            },
            error:{
                keys:[
                    {key:'code'},
                    {key:'price'},
                    {key:'image'},
                    {key:'content'},
                    {key:'id_user'},
                ]  
            },
            gallery:{
                display: false,
                title: 'Galeria de imagenes',
                imageData:[],
            },
            prepareImage:[],
            positionImages:[],
            deletedImagesServer:[]
        }
    },
    methods:{
        setCategory(data){
            this.updateData.category_id = data.id
        },
        image(item){
            var url = baseUrl().cms +'uploads/products/'+item.file_path+'/'+item.image;
            return  url
            },
        showLightBox(image){
            this.ItemsImage = []
            var url = baseUrl().cms +'uploads/products/'+image.file_path+'/'+image.image;
            this.ItemsImage.push(url)
            this.index = 0
        },
        async _updateProduct(){
                this.overlay = true
                this.prepareImage = []
            if(this.gallery.imageData && this.gallery.imageData.length>0){
                 for(let i=0; i<this.gallery.imageData.length; i++){
                    if(this.gallery.imageData[i].split(':')[0] === 'data'){
                        var pre =[]
                            pre.push(this.gallery.imageData[i])
                            this.prepareImage.push(this.converterImage(pre,this.updateData.name))
                    }else{this.prepareImage.push(this.gallery.imageData[i])}
                }
            }
       
        await this.handlerPositionImages()
                .then(()=>{
                    const url = this.updateProduct.url
                    var data = new FormData();
                    data.append('token',this.token);
                    data.append('id',this.updateProduct.data.id);
                    data.append('name',this.updateData.name);
                     data.append('code',this.updateData.code);
                    // append files
                   
                    for(let i=0; i<this.prepareImage.length; i++){
                        if(typeof(this.prepareImage[i]) === 'object'){
                            data.append('image[]',this.prepareImage[i])
                        }
                    }
                    var deletedImagesServer = JSON.stringify(this.deletedImagesServer)
                    data.append('deletedImagesServer',deletedImagesServer)
                    var positions = JSON.stringify(this.positionImages)
                    data.append('sort',positions);   
                    data.append('price',this.updateData.price);
                    data.append('inventory',this.updateData.inventory);
                    data.append('content',this.updateData.content);
                    data.append('in_discount',this.updateData.in_discount);
                    data.append('discount',this.updateData.discount,);
                    data.append('category',this.updateData.category_id);
                    axiosInstance.post(url,data)
                        .then(res => {
                            this.$success()  
                        })
                        .catch(err => {
                        if(err.response.status === 400 || err.response.status === 500 || err.response.status === 404){
                            if(err.response.data.error){
                                var snackbar = {display:true,text:res.error,timeout:8000,color:'error'}
                                return
                            }
                            this.$emit("setSnackbar",snackbar)
                            this.$error(err.response);  
                        }
                        })
                        .finally(()=> {this.overlay = false})
                        
                })
             
        },
        fillFieds(){
            this.$nextTick(()=>{
                this.updateData.code = this.updateProduct.data.code
                this.updateData.name = this.updateProduct.data.name
                this.updateData.price = this.updateProduct.data.price
                this.updateData.inventory = this.updateProduct.data.inventory
                this.updateData.in_discount = this.updateProduct.data.in_discount 
                this.updateData.discount = this.updateProduct.data.discount
                this.updateData.content = this.updateProduct.data.content
                this.updateData.category_id = this.updateProduct.data.category_id
                if(this.updateProduct.data.gallery && this.updateProduct.data.gallery.length > 0){
                    this.updateProduct.data.gallery.forEach((val)=>{
                        var url = 'http://mycms.test/uploads/products/'+val.file_path+'/'+val.file_name;
                        this.gallery.imageData.push(url)
                    })
                }
            })
        },
        $success(){
                const snackbar = {display:true,text:'Actualizado correctamente',timeout:2500,color:'success'}
                this.$emit("setSnackbar",snackbar)
                this.$emit("setDialog", false);
                this.$emit("reloadPaginate")
        },
        $error(res){
            const snackbar = {display:true,text:Object.values(res.data)[0][0],timeout:20000,color:'error'}
            this.$emit("setSnackbar",snackbar)
        },
        setGallery(imagen){
            this.gallery.imageData.push(imagen)
        },
        converterImage(image,name){
          
          var file;
           image.forEach((val) => {
                var typeImg = val.split('/')[1].split(';')[0]
                var arr = val.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), 
                n = bstr.length,
                u8arr = new Uint8Array(n),
                nameImage = name.replace(/[^A-Za-z]/g, "").substr(0,20)+val.split('/')[4].substr(-5);
                var numRamdon= Math.floor(Math.random() * 1000) + 1 ;
                
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
            
               file =  new File([u8arr], numRamdon+'-'+nameImage+'.'+typeImg, {type:mime});
            })
            return file

        },
        async handlerPositionImages(){
           this.positionImages = [];
            var original = this.prepareImage
            if(original && original.length>0){
                original.forEach((val,index)=>{
                    if(typeof val === 'string'){
                        if(val.split(':')[0] === 'http' || val.split(':')[0] === 'https'){
                              var object = {
                                 position:index,
                                 name : val.split('/')[val.split('/').length - 1],
                                 file_path : val.split('/')[val.split('/').length - 2]+'/'+val.split('/')[val.split('/').length - 1],
                                 product_id : this.updateProduct.data.id
                              }
                            this.positionImages.push(object)
                        }
                    }else if(typeof val === 'object'){
                                var object = {
                                    position:index,
                                    name : val.name,
                                    file_path : '',
                                    product_id : this.updateProduct.data.id
                                }
                                this.positionImages.push(object)
                    }
                })
            }
            return this.positionImages;
        }
    },
    created(){
        this.fillFieds()
    },
    computed:{
        largeName(){
            var maxLarge = 60
            var largeCurrent = maxLarge - this.updateData.name.length + '/' + maxLarge
            return largeCurrent 
        },
        nameProduct(){
            return this.updateData.name
        }
    },
    watch:{
        nameProduct(val){
            if(val.length > 60 ){
                var max = this.updateData.name.substring(0,60)
                this.maxName = max
                this.$nextTick(()=>{
                    this.updateData.name = this.maxName
                    
                })
            }
        }
    }
    
}
</script>

<style  scoped >

        .avatar img{
            width:6rem;
            height:5.5rem;
            margin: auto;
        }
        @media (min-width: 600px){
            .avatar img{
                width:7rem;
                height:7rem;
            
            }
        }

</style>