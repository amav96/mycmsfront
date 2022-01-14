<template>
   <v-app>
      <DrawerAdmin/>
   </v-app>
  
</template>

<script>
  import AppBar from '@/components/core/AppBar'
  import DrawerAdmin from '@/components/core/DrawerAdmin'


  export default {
    components:{
      AppBar,
      DrawerAdmin,
      
    },
    data () {
      return {
        doom : false
      }
    },
  }
</script>