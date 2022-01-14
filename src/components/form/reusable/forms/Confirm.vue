<template>
  <div :class="content.class">
        <v-card-title>
        {{content.title}}
        </v-card-title>
        <v-card-actions>
        <v-spacer></v-spacer>
            <v-btn
            :color="content.accept.color"
            @click="$continue()"
            :disabled="handler"
            >
            {{content.accept.title}}
            </v-btn>
            <v-btn
            :color="content.exit.color"
            @click="$exit()"
            :disabled="handler"
            >
            {{content.exit.title}}
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
export default {
    props: ['content'],
    methods: {
            $continue() {
                this.handler = true
                this.$emit("setContinue", true)

            },
            $exit() {
                this.handler = true
                this.$emit("setContinue", false)

            }
        },
    data(){
        return {
            handler : false
        }
    },
    beforeDestroy(){
        this.handler = false
    }
}
</script>

<style>
.v-card__text, .v-card__title {
    word-break: normal;
}
</style>