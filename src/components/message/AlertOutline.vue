<template>
    <div>
         <v-alert
            dense
            outlined
            type="error"
            >
            {{alert.title}}
    </v-alert>
    </div>
</template>

<script>
export default {
    props: ['alert']

}
</script>

<style>

</style>