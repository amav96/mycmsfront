
<template>
  <div class="text-center">
    <v-overlay v-if="loaderFullScreen" >
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>

 export default {
     props:{
         loaderFullScreen :{
             type: Boolean
         }
     },

  }
</script>

<style>

</style>