<template  >
    <transition name="slide-fade">
        <v-dialog
        v-model="DialogSmallScreen.display"
        max-width="290"
        hide-overlay
        >
            <v-card>
                <template>
                <slot></slot>
                </template>
            </v-card>
        </v-dialog>
    </transition>
</template>

<script>
export default {
props:['DialogSmallScreen'],
}
</script>

<style>

</style>