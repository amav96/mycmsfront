<template>

  <v-app class="app" >
    <template v-if="userDB && (userDB.role === 'administrador' || userDB.role === 'vendedor')" >
       <DrawerAdmin/> 
    </template>
    <template v-else-if="userDB && userDB.role === 'usuario'">
      <template  >
         <DrawerUser/> 
      </template>
    </template>
    <template v-else >
      <Drawer/> 
    </template>
   
        <template>
          <v-carousel
            cycle
            height="400"
            hide-delimiter-background
            show-arrows-on-hover
          >
            <template v-slot:prev="{ on, attrs }">
              <v-btn
                color="success"
                v-bind="attrs"
                v-on="on"
              >Previous slide</v-btn>
            </template>
            <template v-slot:next="{ on, attrs }">
              <v-btn
                color="info"
                v-bind="attrs"
                v-on="on"
              >Next slide</v-btn>
            </template>
            <v-carousel-item
              v-for="(slide, i) in slides"
              :key="i"
            >
              <v-sheet
                :color="colors[i]"
                height="100%"
              >
                <v-row
                  class="fill-height"
                  align="center"
                  justify="center"
                >
                  <div class="text-h2">
                    {{ slide }} Slide
                  </div>
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </template>
        <v-row class="d-flex justify-center flex-row" > 
          <template>
            <v-card
              class="mx-auto my-2"
              max-width="344"
            >
              <v-card-text>
                <div>Word of the Day</div>
                <p class="text-h4 text--primary">
                  el·ee·mos·y·nar·y
                </p>
                <p>adjective</p>
                <div class="text--primary">
                  relating to or dependent on charity; charitable.<br>
                  "an eleemosynary educational institution."
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="teal accent-4"
                  @click="reveal = true"
                >
                  Learn More
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <v-card
                  v-if="reveal"
                  class="transition-fast-in-fast-out v-card--reveal"
                  style="height: 100%;"
                >
                  <v-card-text class="pb-0">
                    <p class="text-h4 text--primary">
                      Origin
                    </p>
                    <p>late 16th century (as a noun denoting a place where alms were distributed): from medieval Latin eleemosynarius, from late Latin eleemosyna ‘alms’, from Greek eleēmosunē ‘compassion’ </p>
                  </v-card-text>
                  <v-card-actions class="pt-0">
                    <v-btn
                      text
                      color="teal accent-4"
                      @click="reveal = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
              </v-card>
          </template>
          <template>
            <v-card
              class="mx-auto my-2"
              max-width="344"
            >
              <v-card-text>
                <div>Word of the Day</div>
                <p class="text-h4 text--primary">
                  el·ee·mos·y·nar·y
                </p>
                <p>adjective</p>
                <div class="text--primary">
                  relating to or dependent on charity; charitable.<br>
                  "an eleemosynary educational institution."
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="teal accent-4"
                  @click="reveal = true"
                >
                  Learn More
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <v-card
                  v-if="reveal"
                  class="transition-fast-in-fast-out v-card--reveal"
                  style="height: 100%;"
                >
                  <v-card-text class="pb-0">
                    <p class="text-h4 text--primary">
                      Origin
                    </p>
                    <p>late 16th century (as a noun denoting a place where alms were distributed): from medieval Latin eleemosynarius, from late Latin eleemosyna ‘alms’, from Greek eleēmosunē ‘compassion’ </p>
                  </v-card-text>
                  <v-card-actions class="pt-0">
                    <v-btn
                      text
                      color="teal accent-4"
                      @click="reveal = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
              </v-card>
          </template>
          <template>
            <v-card
              class="mx-auto my-2"
              max-width="344"
            >
              <v-card-text>
                <div>Word of the Day</div>
                <p class="text-h4 text--primary">
                  el·ee·mos·y·nar·y
                </p>
                <p>adjective</p>
                <div class="text--primary">
                  relating to or dependent on charity; charitable.<br>
                  "an eleemosynary educational institution."
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="teal accent-4"
                  @click="reveal = true"
                >
                  Learn More
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <v-card
                  v-if="reveal"
                  class="transition-fast-in-fast-out v-card--reveal"
                  style="height: 100%;"
                >
                  <v-card-text class="pb-0">
                    <p class="text-h4 text--primary">
                      Origin
                    </p>
                    <p>late 16th century (as a noun denoting a place where alms were distributed): from medieval Latin eleemosynarius, from late Latin eleemosyna ‘alms’, from Greek eleēmosunē ‘compassion’ </p>
                  </v-card-text>
                  <v-card-actions class="pt-0">
                    <v-btn
                      text
                      color="teal accent-4"
                      @click="reveal = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
              </v-card>
          </template>
        </v-row>
    
      
  </v-app>
</template>

<script>
// @ is an alias to /src
import Drawer from '@/components/core/Drawer'
import DrawerAdmin from '@/components/core/DrawerAdmin'
import DrawerUser from '@/components/core/DrawerUser'
import {mapState} from 'vuex'
export default {
  name: 'Home',
  components: {
    Drawer,DrawerAdmin,DrawerUser
  },
  data(){
    return {
      routeCurrent: '',
      colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
        ],
        slides: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
        ],
        reveal: false,
    }
  },

  computed:{
    ...mapState('auth',['userDB']),
   
    widthScreen(){
      return  this.$vuetify.breakpoint.width
    }
  }, 
 

}
</script>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>





