<template>
    <v-progress-linear 
    class="fixed"
    color="blue lighten-1" 
    indeterminate
    ></v-progress-linear>       
</template>

<script>
export default {

}
</script>

<style>
 .fixed{
     position: fixed !important;
     z-index: 1000;
 }
</style>