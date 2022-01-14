<template>
    <div>
        <div  class="gallery">

            <v-overlay v-if="overlay" color="white" >
                <v-progress-circular
                indeterminate
                size="64"
                color="info"
                ></v-progress-circular>
            </v-overlay>
         
            <template v-if="imageData.length > 0" >
                    <div class="box-gallery">
                            <div @click="galleryImage.display = true" class="mini-select">
                                <div >
                                    <v-icon>
                                    mdi-camera-image
                                    </v-icon>
                                </div>
                            </div>
                            <div class="gallery-draggable" >
                                <div class="mini-image" v-for="(img,index) in imagesDraggable" :key="index">
                                    <div  class="box-img">
                                        <img  style="margin:0px 3px;"  :src="img"  >
                                    </div>
                                </div>
                            </div>
                    </div>
            </template>
            
            <template v-else >
                <v-col @click="$refs.file.click()" class="container-select" cols="12" xl="12" lg="12" sm="12" >
                        <div class="select-image">
                            <div>
                                <v-icon >
                                mdi-camera-image
                                </v-icon>
                            </div>
                            <div>
                                Agregar Fotos
                            </div>
                        </div>
                        <input type="file" @change="uploadImage" accept="image/png, image/jpeg, image/jpg" ref="file" style="display: none" >
                </v-col>
            </template>
        </div>
        <template v-if="galleryImage.display" >
            <DialogFullScreen  :DialogFullScreen="galleryImage">
                <v-container>
                    <v-row class="d-flex justify-center flex-column">
                        <v-row class="d-flex justify-center flex-row my-2" >
                            <v-btn
                            fab
                            small
                            color="info"
                            @click="deleteImage(slide.passingIndex)"
                            >
                                <v-icon>
                                    mdi-trash-can-outline
                                </v-icon>
                            </v-btn>
                            
                        </v-row>
                        <div class="main-gallery" >
                        <Slide 
                        :passingIndex="slide.passingIndex" 
                        :render="imagesDraggable" 
                        @goToNext="slide.passingIndex = $event"
                        @goToPrev="slide.passingIndex = $event"
                        />

                        <div class="box-gallery my-2">
                            <template v-if="imageData && imageData.length > 0" >
                                <draggable class="gallery-draggable" v-model="imagesDraggable" group="people" @start="drag=true" @end="drag=false">
                                    <div class="mini-image" v-for="(img,index) in imagesDraggable" :key="index">
                                            <div @click="slide.passingIndex = index" class="box-img">
                                                <img  style="margin:0px 3px;"  :src="img"  >
                                            </div>
                                            <template v-if="index === 0">
                                                    <div class="cover">
                                                        <span class="cover-page" >PORTADA</span>
                                                    </div>
                                            </template>
                                    </div>

                                </draggable>
                            </template>
                        </div>
                    
                        <v-btn 
                        @click="$refs.fileGallery.click()"
                        color="white"
                        class="mt-2 blue--text" 
                        :block="widthButtonUploadMore"
                        :disabled="imageData.length > 2"
                        
                        >
                            <template v-if="loadingImage">
                                <v-progress-circular
                                indeterminate
                                
                                color="info"
                                ></v-progress-circular>
                            </template>
                            <template v-else>
                                Cargar mas fotos
                            </template>
                        </v-btn>
                        </div>
                    </v-row>
                <input type="file" @change="uploadImage" accept="image/png, image/jpeg, image/jpg" ref="fileGallery" style="display: none" >
            </v-container>
            </DialogFullScreen>
        </template>
        
    </div>
</template>

<script>
import DialogFullScreen from '@/components/dialog/reusable/DialogFullScreen'
import draggable from 'vuedraggable'
import Slide from '@/components/image/reusable/Slide'
export default {
    components:{Slide,draggable,DialogFullScreen},
    props:['imageData'],
    computed:{
        loadingImage(){
            if(this.galleryImage.loadingImage === 0 || this.galleryImage.loadingImage === 1){
                return true
            }else{
                return false
            }
        },
        widthButtonUploadMore() {
        switch (this.$vuetify.breakpoint.name) {
            case 'xs': return true
            case 'sm': return true
            case 'md': return true
            case 'lg': return false
            case 'xl': return false
            }
        }
    },
    data(){
        return{
            slide:{
                passingIndex: 0
            },
            imagesDraggable:[],
            deleteActive: false,
            indexHover : '',
            galleryImage:{
                display: false,
                title: 'Agregar fotos de tu producto',
                loadingImage: 2,
            },
            overlay : false,

          
        }
    },
    methods:{
        uploadImage(event){
            if(event.target.files[0] !== undefined && event.target.files[0] !== ''){
                var reader = new FileReader();
                this.galleryImage.loadingImage = reader.readyState
                reader.onload = (e) => {
                    this.galleryImage.loadingImage = reader.readyState
                    this.$emit("setImageData",e.target.result)
                    this.$nextTick(()=>{
                        this.numberOfImages()
                    })
            }
            reader.readAsDataURL(event.target.files[0]);
                this.galleryImage.loadingImage = reader.readyState
            }
                
        },
        numberOfImages(){
            if(this.imagesDraggable.length === 1){
                if(!this.galleryImage.display){
                    this.galleryImage.display = true
                }
            }
            
        },
        deleteImage(index){
            const newImages = this.imagesDraggable.filter((item,i) => i!== index)
            this.imagesDraggable = newImages
            console.log(this.imagesDraggable)
            this.$emit("setDeleteImageData",this.imagesDraggable)
            if(index>0 && index<2){
                this.slide.passingIndex = 0
            }
            if(index>=2){
                this.slide.passingIndex = (this.slide.passingIndex - 1)
            }
            
        },
        loadingDialog(){
                this.overlay = true
                setTimeout(() => {
                this.overlay = false
                }, 300);
        },
       
        
    },
    watch:{
        imageData(val){
            this.imagesDraggable = val
            
        },
        imagesDraggable(val){
            this.$emit("setDraggable", val)
        },
        galleryImage :{
            handler(value){
                this.loadingDialog()
            },deep:true
        }
    }
   
}
</script>

<style scoped >

    .container-select{
        border: 2px solid rgb(126, 181, 253);
        border-radius: 6px;
        cursor: pointer;
    }
    .select-image{
        height:5rem;
        display: flex;
        justify-content: center;
        flex-direction:column;
        align-items: center;
    }
    .main-gallery{
        display:flex;
        justify-content:center;
        flex-direction: column;
        align-content: center;
        align-items: center;
    }
    .gallery{
        display:flex;
        justify-content:flex-start;
        flex-direction: row;
        align-content: center;
        align-items: center;
    }   
    .box-gallery{
        width: 250px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: auto;
        overflow-x: auto;
        overflow-y: hidden;
        display:flex;
        justify-content:flex-start;
        flex-direction: row;
        align-content: center;
        align-items: center;
        margin: auto;
    }
    @media (min-width:300px){
         .box-gallery{ width: 280px;}
    }
     @media (min-width:360px){
        .box-gallery{ width: 320px;}
    }
    
    @media (min-width:420px){
       .box-gallery{ width: 300px;}
    }
     @media (min-width:720px){
        .arrow{
            display: block;
        }
    }


    @media (min-width:720px){
        .box-gallery{
            width:100%;
            justify-content:center;
            overflow-x: hidden;
            overflow-y: hidden;
        }
    }
   
    .mini-select{
        height:6rem;
        min-width: 6rem !important;
        border: 2px solid rgb(126, 181, 253);
        border-radius: 2px;
        cursor: pointer;
        display: flex;
        justify-content:center;
        align-content: center;
        align-items: center;
       
    }

    .mini-image{
        position: relative;
        min-height:6rem;
        width: 6rem;
        border: 1px solid rgb(245, 220, 220);
        border-radius: 2px;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 15%), 0 0 1px 1px rgb(0 0 0 / 5%);
        margin: 0px 3px;
        display: flex;
        justify-content:center;
        align-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        
    }
    
    .box-img img{
        display: flex;
        justify-content: center;
        flex-direction: row;
        max-height:6rem;
        max-width: 6rem;
        margin: auto 0px !important;
        transition: 0.5s;
        
    }
    .cover{
        position: absolute;
        top: 50px;
        background-color: rgba(255, 255, 255, 0.945);
        width: 6rem;
        height:46px;
        text-align:center;
        display: flex;
        justify-content:center;
        align-content: center;
        align-items: center;
    }
    .cover-page{
        background-color: rgba(0,166,80,.3);
        color: #00a650;
        padding:3px 10px;
        border-radius: 13px;
        font-size:15px;
        font-weight:800px;
    }
  
    .gallery-draggable{
        display:flex;
        justify-content:center;
        flex-direction: row;
        align-content: center;
        align-items: center;
    }

</style>