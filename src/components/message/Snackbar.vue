<template>
  <v-snackbar
      v-model="snackbar.display"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      width="100%"
    >
      {{snackbar.text}}
    </v-snackbar>
</template>

<script>
export default {
    props:['snackbar']

}
</script>

<style>

</style>