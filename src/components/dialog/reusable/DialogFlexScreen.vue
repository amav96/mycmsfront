<template id="inspire">
    <transition name="slide-fade">
                    <v-dialog
                    v-model="DialogFlexScreen.display"
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
                                @click="DialogFlexScreen.display = false"
                                >
                                    <v-icon >mdi-arrow-left</v-icon>
                                </v-btn>
                            </div>
                            <div >
                                 <v-toolbar-title >{{DialogFlexScreen.title}}</v-toolbar-title>
                            </div>
                           
                        </div>
                            
                            
                                
                        </v-toolbar>
                        <template>
                            <slot></slot>
                        </template>
                    </v-card>
                </v-dialog>
               
                
        
    </transition>
           
</template>

<script>
export default {
    props:['DialogFlexScreen'],
 data(){
     return {
        
     }
 },
 computed: {
      width () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 600
          case 'sm': return 400
          case 'md': return 500
          case 'lg': return 600
          case 'xl': return 800
        }
      },
    },
}
</script>

<style scoped >

   


</style>