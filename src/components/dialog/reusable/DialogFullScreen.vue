<template id="inspire">
    <transition name="slide-fade">
        <v-row justify="center">
                <v-dialog
                    v-model="DialogFullScreen.display"
                    fullscreen
                    hide-overlay
                    info
                    height="100%"
                >
                    <v-card>
                        <v-toolbar
                            dark
                            color="info"
                            height="100"
                        >
                        <div class="  d-flex flex-column justify-start" >
                            <div class="d-flex flex-row justify-start">
                                <v-btn
                                class="d-flex justify-start"
                                icon
                                dark
                                @click="DialogFullScreen.display = false"
                                >
                                    <v-icon class="mx-auto" >mdi-arrow-left</v-icon>
                                </v-btn>
                            </div>
                            <div >
                                 <v-toolbar-title >{{DialogFullScreen.title}}</v-toolbar-title>
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
    props:['DialogFullScreen'],
}
</script>

<style  >

</style>