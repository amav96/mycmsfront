<template>
  <v-row class="d-flex flex-column">
          <div class="d-flex flex-row my-2"  >
            <v-icon>
              {{FormGeneral.icon}}
            </v-icon>
            <div>
              <span> {{FormGeneral.title}} </span>
            </div>
          </div>
          <div class="my-1">
            <v-card class="rounded-xl"  elevation="3">
                <slot></slot>
            </v-card>
          </div>
          <div class="my-1 mt-2">
            <v-btn 
            rounded
            block
            color="info"
            @click="active()"
            :disabled="disabledFGeneral"
            >
            Guardar
          </v-btn>
          </div>
        </v-row>
</template>

<script>
export default {
    props:{
        FormGeneral:{
            type: Object
        },
        disabledFGeneral:{
            type: Boolean
        }
    },
    methods:{
      active(){
        this.$emit("active")
      }
    }

}
</script>

<style>

</style>