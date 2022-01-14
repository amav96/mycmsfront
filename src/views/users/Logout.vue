<template>
  <div>
        <v-overlay opacity="2" color="white" >
            <v-progress-circular
              indeterminate
              size="64"
              color="info"
            ></v-progress-circular>
        </v-overlay>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    methods:{
         ...mapActions('auth',['logout']),
        async $_logout(){
            const token = localStorage.getItem('auth')
                if(token !== null){
                    await this.logout(token)  
                }
        },
    },
    created(){
        this.$_logout();
       
    },
    
}
</script>

