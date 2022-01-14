<template>
  <div>
      <v-card>
        <v-tabs
            background-color="white"
            show-arrows
            color="info"
            v-model="moduleCurrent"
        >
            <v-tabs-slider color="info"></v-tabs-slider>
                <v-tab
               
                v-for="item in items"
                :key="item.id"
                @click="$selected(item)"
                :value="item.id"
                
                >
            {{item.slug}}
            </v-tab>
        </v-tabs>
        </v-card>
  </div>
</template>

<script>
import axiosInstance from '@/services/api/axiosInstance'
import {mapState} from 'vuex'
export default {
    props:['url'],
    data(){
        return {
            items : [],
            moduleCurrent: 1
        }
    },
    methods:{
        _getModules() {
            const url = this.url
            axiosInstance.get(url,{
              params : {
                  token : this.token
              }
            })
            .then(res => {
                if (res.data.error) {
                    alert("No hay datos disponibless");
                    return
                }
                this.items = res.data
            })
            .catch(err => {
                console.log(err)
            })
        },
        $selected(item){
            this.$emit("selected",item)
        }
    },
    computed :{
        ...mapState('auth',['token']),
    },
    created(){
        this._getModules();
    },
    watch:{
        test(val){
            console.log(val)
        }
    }
}
</script>
