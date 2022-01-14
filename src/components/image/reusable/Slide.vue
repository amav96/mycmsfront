<template>
    <div class="slide my-1 grey lighten-5" id="slide">
        <template v-if="render && render.length > 0">
                <div class="inSlide" >
                     <div class="arrow" >
                        <v-btn 
                        fab
                        small
                        class=" ma-2"
                        :disabled="showPrev"
                        @click="clickPrev()"
                        >
                        <v-icon>
                        mdi-chevron-left
                        </v-icon>
                        </v-btn>
                    </div> 
                       <div class="img-gallery">
                            <transition name="slide-fade">
                                <img v-show="!loadRenderImg" @load="loadRenderImg = false" ref="renderImg" :src="render[passingIndex]" >
                            </transition>
                        </div>
                    <div class="arrow" >
                        <v-btn 
                        :disabled="showNext"
                        fab
                        small
                        class="ma-2"
                        @click="clickNext()"
                        >
                        <v-icon>
                        mdi-chevron-right
                        </v-icon>
                    </v-btn>
                    </div> 
                </div>
        </template>
    </div>
        
</template>

<script>
export default {
    props:['passingIndex','render'],
    computed:{
        showNext(){
            
            const renderCurrent = this.passingIndex + 1
            if(this.render.length>1 && renderCurrent < this.render.length){return false}
            else {return true}
        },
        showPrev(){
            const renderCurrent = this.passingIndex - 1
             if(this.render.length>1 && renderCurrent >= 0 ){return false}
             else {return true}
        }
    },
    data(){
        return{
            touchstartX : 0,
            touchendX : 0,
            activeIndex : 0,
            loadRenderImg: true
        }
    },
    methods:{
        
        touchstart(e){
            this.touchstartX = e.changedTouches[0].screenX;
        },
        touchend(e){
            this.touchendX = e.changedTouches[0].screenX;
            this.handleGesture()
             
        },
        handleGesture(){
            if(Math.abs(this.touchendX - this.touchstartX) < 60) return

            if(this.touchendX < this.touchstartX) this.goToNext()
            if(this.touchendX > this.touchstartX) this.goToPrevious()

        },
        goToPrevious(){
            const renderCurrent = this.passingIndex - 1
            if(renderCurrent < 0 ) return 
             this.$emit("goToPrev", renderCurrent)
        },
         goToNext(){
            const renderCurrent = this.passingIndex + 1
            if(renderCurrent >= this.render.length) return  
             this.$emit("goToNext", renderCurrent)
        },
        clickNext(){
            const renderCurrent = this.passingIndex + 1
            this.$emit("goToNext", renderCurrent)
        },
        clickPrev(){
            const renderCurrent = this.passingIndex - 1
            this.$emit("goToPrev", renderCurrent)
        }
    },
    mounted(){
        document.getElementById('slide').addEventListener('touchstart', this.touchstart);
        document.getElementById('slide').addEventListener('touchend', this.touchend);
    },
}
</script>

<style scoped>

.slide{
    /* background:rgb(231, 225, 225); */
    width: 18rem;
    padding:5px !important;
    margin: auto;
    min-height:18rem;
    max-height:20rem;
    display: flex;
    justify-content:center;
    align-content: center;
    align-items: center;
    align-self: center;
}
    .arrow{
        display: none;
    }
    .slide img {
        display: block; 
        margin: auto;
        width: auto;
        height: auto;
        max-width:16rem;
        max-height:18rem;
    }
    @media (min-width:300px){
        .slide img{max-width:18rem;}
        .slide{width:18rem;}
    }
     @media (min-width:360px){
        .slide img{max-width:22rem;}
        .slide{width:22rem;}
        
    }
    @media (min-width:380px){
        .slide img{max-width:23rem;}
        .slide{width:23rem;}
    }
    @media (min-width:420px){
        .slide img{max-width:24rem;}
        .slide{width:24rem;}
    }
     @media (min-width:720px){
        .arrow{display: block;}
        .slide{width:25rem;}
    }
    
.inSlide{
    display: flex;
    flex-direction:row;
    justify-content:center;
    align-content: center;
    align-items: center;
    align-self: center;
    max-height:20rem;
}

.img-gallery img{
    padding:5px !important;
}

</style>