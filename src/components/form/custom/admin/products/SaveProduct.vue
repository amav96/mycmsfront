<template>
        <v-container >
                
            <v-overlay v-if="overlay" color="white" >
                <v-progress-circular
                indeterminate
                size="64"
                color="info"
                ></v-progress-circular>
            </v-overlay>
           
            <v-row class="py-4 mx-6 d-flex justify-start flex-column" >

                <v-col  cols="12" lg="12" md="6" xs="12" >
                   <GalleryImage
                    :imageData="gallery.imageData"
                    @setImageData="setGallery($event)"
                    @setDeleteImageData="gallery.imageData =  $event"
                    @setDraggable="gallery.imageData =  $event"
                    />
                </v-col>
                <v-row class="d-flex justify-start flex-row">
           
                    <v-col  cols="12" lg="4" md="6" xs="12" >
                        <v-text-field
                        v-model="product.name"
                        class="mx-2"
                        color="info"
                        label="Nombre del producto"
                        :hint="largeName"
                       
                        />
                    </v-col>

                    <v-col  cols="12" lg="4" md="6" xs="12" >
                        <v-text-field
                        v-model="product.code"
                        class="mx-2"
                        color="info"
                        label="Codigo del producto"
                        
                        />
                    </v-col>

                    <v-col cols="12" lg="4" md="6" xs="12" >
                        <CompleteSearch
                        :searchID="categoryDefault"
                        title="Categoria" 
                        :url="url.getCategories"
                        :token="token"
                        :customClass="customClass.select"
                        @exportVal="setCategory($event)" 
                        />
                    </v-col>

                    <v-col  cols="12" lg="4" md="6" xs="12" >
                        <v-text-field
                        v-model="product.price"
                        class="mx-2"
                        color="info"
                        label="Precio"
                        />
                    </v-col>

                    <v-col  cols="12" lg="4" md="6" xs="12" >
                        <v-text-field
                        v-model="product.inventory"
                        class="mx-2"
                        color="info"
                        label="Stock"
                        
                        />
                    </v-col>

                    <v-col  cols="12" lg="4" md="6" xs="12" >
                        <v-select
                        v-model="product.inDiscount"
                        class="mx-2"
                        color="info"
                        label="¿En descuento?"
                        :items="inDiscountItems"
                        item-text="text"
                        item-value="value"
                        
                        
                        >
                        </v-select>
                    </v-col>

                    <template v-if="product.inDiscount === 1">
                        <v-col  cols="12" lg="4" md="6" xs="12" >
                            <v-text-field
                            v-model="product.discount"
                            class="mx-2"
                            color="info"
                            type="number"
                            label="Descuento"
                            />
                        </v-col>
                    </template>

                    
                    <v-col  cols="12" lg="6" md="6" xs="6" >
                        <v-textarea
                        v-model="product.content"
                        label="Descripciòn del producto"
                        class="mx-2"
                        color="info"
                        rows="2"
                        row-height="20"
                        
                        
                        ></v-textarea>
                    </v-col>
                 </v-row>

               <v-col class="mx-auto px-6" cols="12" lg="6" xs="6"  >
                    <v-btn 
                        block 
                        color="success" 
                        class="py-6" 
                        rounded @click="_save()" 
                        :disabled="validateForm"
                        >
                            Publicar
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
</template>

<script>

import GalleryImage from '@/components/form/reusable/forms/GalleryImage'
import CompleteSearch from '@/components/form/reusable/select/CompleteSearch'
import axiosInstance from '@/services/api/axiosInstance'

export default {
    props:['token','userDB','saveProduct','snackbar'],
    components:{
      CompleteSearch,
      GalleryImage
    },
    data(){
        return {
            url:{
                getCategories:'/products/categories',
            },
            categoryDefault : '2',
            customClass:{
                select: {
                color: 'dark',
                class: 'mx-2',
                outlined: false,
                dense:false
                }
            },
            inDiscountItems:[
                {text:"Si", value:1},
                {text:"No", value:0}
            ]
            ,
            product:{
                id_user: '',
                code:'',
                image:[],
                name:'',
                category: '',
                price:'',
                inventory:'',
                inDiscount:'',
                discount:0,
                content:''
                },
            overlay : false,
            gallery:{
                display: false,
                title: 'Galeria de imagenes',
                imageData:[],
            },
            maxName:''
        }
    },
    methods:{
        _save(){
       
            this.converterImage(this.gallery.imageData,this.product.name)
                .then(()=>{
                    this.overlay = true
                    const url = this.saveProduct.url
                    var data = new FormData();
                    data.append('token',this.token);
                    data.append('code',this.product.code.toUpperCase());
                    data.append('name',this.product.name);
                    data.append('image',this.product.image);
                    // append files
                    for(let i=0; i<this.product.image.length; i++){
                    data.append('image[]', this.product.image[i])
                    }
                    data.append('price',this.product.price);
                    data.append('inventory',this.product.inventory);
                    data.append('content',this.product.content);
                    data.append('in_discount',this.product.inDiscount);
                    data.append('discount',this.product.inDiscount,);
                    data.append('category',this.product.category);
                    axiosInstance.post(url,data,{
                        headers: {
                            'Content-Type': 'multipart/form-data'
                            }
                    })
                    .then(res => {
                        
                    this.$emit("setDialog", false);
                    this.$emit("getProducts")
                    const snackbar = {display:true,text:'Creado correctamente',timeout:2500,color:'success'}
                    this.$emit("setSnackbar",snackbar)
                    
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
        $error(res){
            const snackbar = {display:true,text:Object.values(res.data)[0][0],timeout:8000,color:'error'}
            this.$emit("setSnackbar",snackbar)
        },
        async converterImage(image,name){
          var countName = 0
          await  image.forEach((val) => {
                var typeImg = val.split('/')[1].split(';')[0]
                var arr = val.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), 
                n = bstr.length,
                u8arr = new Uint8Array(n),
                nameImage = name.replace(/[^A-Za-z]/g, "").substr(0,20);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
            
               var file =  new File([u8arr], countName+'-'+nameImage+'.'+typeImg, {type:mime});
                this.product.image.push(file)
               
                countName ++
            })
            return true

        },
        setCategory(data){
            this.product.category = data.id
        },
        setGallery(imagen){
            this.gallery.imageData.push(imagen)
        },
    },
    computed :{
        validateForm() {
            if( this.product.name === '' ||
                this.product.name.length > 60 ||
                this.product.code === '' ||
                this.product.imageOne === '' ||
                this.product.price === '' ||
                this.product.inventory === '' ||
                this.product.content === '' ||
                this.product.inDiscount === '' ||
                this.product.category === '' ||
                this.userDB.id === '' ||
                this.gallery.imageData.length === 0
            ){
                return true
            }else {
                return false
            }
        },
        largeName(){
            var maxLarge = 60
            var largeCurrent = maxLarge - this.product.name.length + '/' + maxLarge
            return largeCurrent 
        },
        nameProduct(){
            return this.product.name
        }
    },
    watch:{
        nameProduct(val){
            if(val.length > 60 ){
                var max = this.product.name.substring(0,60)
                this.maxName = max
                this.$nextTick(()=>{
                    this.product.name = this.maxName
                    
                })
            }
        }
    }
    
}
</script>

