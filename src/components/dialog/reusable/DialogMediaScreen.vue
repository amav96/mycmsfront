<template id="inspire">
    <transition name="slide-fade">
        <v-row justify="center">
                <v-dialog
                    v-model="DialogMediaScreen.display"
                    :max-width="DialogMediaScreen.maxWidth"
                    :hide-overlay="DialogMediaScreen.hideOverlay"
                    :persistent="DialogMediaScreen.persistent"
                >
                    <v-card>
                        <v-toolbar
                            :height="DialogMediaScreen.heightToolbar"
                            :dark="DialogMediaScreen.dark"
                            :color="DialogMediaScreen.color"
                        >
                        <div class="  d-flex flex-column justify-start" >
                            <div class="d-flex flex-row justify-start">
                                <v-btn
                                class="d-flex justify-start"
                                icon
                                @click="DialogMediaScreen.display = false"
                                >
                                    <v-icon class="mx-auto" >mdi-arrow-left</v-icon>
                                </v-btn>
                            </div>
                            <div >
                                 <v-toolbar-title >{{DialogMediaScreen.title}}</v-toolbar-title>
                            </div>
                           
                        </div>
                            
                        </v-toolbar>
                        <template>
                            <slot></slot>
                        </template>
                    </v-card>
                </v-dialog>
        </v-row>
    </transition>
           
</template>

<script>
export default {
    props:['DialogMediaScreen'],
 data(){
     return {
        test:true
     }
 }
}
</script>

<style  >

</style>