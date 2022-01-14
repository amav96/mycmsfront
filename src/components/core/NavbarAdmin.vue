<template>
  <v-app-bar app color="info" dark height="90">
     
      
          <v-btn
            class="mr-3" elevation="0" color="info" fab small @click="setDrawer()"
          >
          <v-icon >mdi-menu</v-icon>
        </v-btn>
      
      <template v-if="!isMobile || isLogin">
        <router-link 
        to="/"
        class="navbar-brand" 
        exact-path
         >
          <div class="logo" >
            <v-img
                src="http://mycms.test/images/logo/logo.png"
                max-height="53"
                max-width="100"
                
              />
          </div>
        </router-link>

      </template>
      
    <template v-if="!isLogin" >
      <div class="input-container">
        <form>
            <input class="input-search" placeholder="Buscar productos" type="text">  
            <i  @click="test()" class="fa fa-search "></i>
        </form>
        
      </div>
    </template>
      
      <v-spacer></v-spacer>

      <template v-if="!isLogin" >
        
        <template v-if="!isMobile">
            <template v-if="!auth" >
              <router-link 
                v-if="!isLogin"
                to="/login"
                exact-path
                >
                <div class="mx-2 ">
                    <v-icon class="info mx-1">
                      mdi-account-circle
                    </v-icon>
                  <span style="font-weight: 500;letter-spacing: 0.0892857143e" class="white--text text-md-body-1" >Ingresá</span>
                </div>
              </router-link>
              <div class="mx-2" >
                  <span style="font-weight: 500;letter-spacing: 0.0892857143e" class="mr-2">Sobre nosotros</span>
              </div>
            </template>
            <template v-else>

             
              <v-menu
                transition="slide-y-transition"
                bottom
                open-on-hover
                 offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <div 
                  v-bind="attrs"
                  v-on="on">
                    <v-icon class="info mx-1">
                        mdi-account-circle
                    </v-icon>
                    <span style="font-weight: 500;letter-spacing: 0.0892857143e" class="white--text text-md-body-1" >{{userDB.firstName}}</span>
                    <v-icon class="info mx-1 mr-3">
                        mdi-chevron-down
                    </v-icon>
                  </div>
                </template>
                <v-list>
                  <div  
                    v-for="(item, i) in menu"
                    :key="i"
                  >
                   <router-link :to="item.link">
                      <template  v-if="item.divider">
                        <v-divider 
                        ></v-divider>
                      </template>
                        
                      <v-list-item
                      dense
                      link
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                  </router-link>
                  </div>
                </v-list>
              
              </v-menu>


              <!-- <div class="mx-2 ">
                    <v-icon class="info mx-1">
                      mdi-account-circle
                    </v-icon>
                  <span style="font-weight: 500;letter-spacing: 0.0892857143e" class="white--text text-md-body-1" >{{userDB.firstName}}</span>
              </div> -->
            </template>
        </template>
      
      
         <div class="car" >
            <v-icon>
              mdi-cart-outline
            </v-icon>
        </div>
      </template> 
    </v-app-bar>
    
</template>

<script>
import {mapState,mapActions,mapMutations} from 'vuex'
export default {
      data(){
        return {
          isHome:true,
            menu: [
            { title: 'Publicaciones',divider:false , link:'/ventas/productos'  },
            { title: 'Mis datos',divider:true , link:'/profile'  },
            { title: 'Salir' ,divider:true , link:'/salir' },
         
          ],
        }
      },
      methods: {
      ...mapActions('auth',['logout']),
      ...mapMutations(['SET_DRAWER']),
      setDrawer(){
        this.SET_DRAWER(!this.drawer);
      },
      async $_logout(){
        const token = localStorage.getItem('auth')
        if(token !== null){
          await this.logout(token)  
        }
      },
      handlerRoutes(to,from){
        if(to.name !== 'Home'){
            this.isHome = false
        }else{
          this.isHome = true
        }
        
      },
      test(){
        alert("buscando")
      }
   },
    computed:{
      ...mapState('auth',['userDB','auth']),
       ...mapState(['drawer']),
      isMobile(){
       
        if(this.$vuetify.breakpoint.width < 720){
          return true
        }else{return false}
        
      },
      isLogin(){
        if(this.$route.name === 'Register' || this.$route.name === 'Login' || this.$route.name === 'Registration' || this.$route.name === 'RestorePassword' || this.$route.name === 'ResetPassword'){
          return true
        }else{
          return false
        }

      },
      widthScreen(){
        return  this.$vuetify.breakpoint.width
      }
      
    },
     watch: {
      $route(to, from) {
        this.handlerRoutes(to, from);
       
      }
    }
}
</script>

<style>

@import '../../assets/styles/core/navbarUser.css';

.back{
  background: rgb(177, 163, 44);
 
}

.v-application a {
    text-decoration: none !important;
   
}


</style>