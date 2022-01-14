<template>
  <v-app class="app" >
   
    <template v-if="loadingGlobal || $route.name === null ">
      <v-overlay opacity="2" color="white" >
        <v-progress-circular
          indeterminate
          size="64"
          color="info"
        ></v-progress-circular>
    </v-overlay>
    </template>
    <template v-else>
      <template v-if="userDB && (userDB.role === 'administrador' || userDB.role === 'vendedor')">
        <NavbarAdmin/>
      </template>
      <template v-else>
        <NavbarUser/>
      </template>
    
    </template>
    
  <v-main >
     <Linear v-if="loadingBetweenRoutes" />  
     
        <!-- ponerle el paddin 0.1px o 0px al container cuando este en la pantlla mobile -->
        <transition name="fade" mode="out-in">
          <router-view  ></router-view>
        </transition>
  </v-main>
    
  </v-app>
</template>

<script>
import {mapActions,mapState} from 'vuex'
import NavbarAdmin from './components/core/NavbarAdmin';
import NavbarUser from './components/core/NavbarUser';


import Linear from '@/components/loader/Linear'
export default {
  name: 'App',

  components: {
    NavbarAdmin,NavbarUser,Linear
  },

  data: () => ({
    doom: false,
    //
  }),
  methods:{
    ...mapActions('auth',['readToken','loadingBeforeRouterIsNull']),
   async $_readToken(){
      const token = localStorage.getItem('auth')
      if(token !== null){
         await this.readToken(token)
      }
      
    }
  },
  computed:{
     ...mapState('auth',['loadingGlobal','loadingBetweenRoutes','userDB']),
  },
  created(){
      this.$_readToken()
   },
};
</script>
<style>

@import './assets/styles/table.css';
@import './assets/styles/resources.css';

  .app {
    background:rgb(238, 235, 235) !important;
    }


    /* alternativeScreen */
 
    .alternativeScreen{
      margin-top: 1rem;
      box-shadow: 0 0.0625rem 0.125rem 0 rgb(0 0 0 / 50%) !important;
    }

    /* .v-list .v-list-item--active { 
      background-color: rgb(89, 170, 247)!important; 
    }

    .v-list .v-list-item--active .v-list-item__title {
      color: white !important;
    } */

 @media (max-width: 480px){
      .container{
            padding:0px;
            
      }
      .row{
          margin: 0px !important;
        }

      /* alternativeScreen */

    .alternativeScreen{
          margin-top: 0rem;
          box-shadow: none !important;
        }
    }



</style>
