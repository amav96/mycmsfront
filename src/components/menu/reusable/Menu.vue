<template>
  <v-menu
        bottom origin="center center" transition="scale-transition"
        >
        <template v-slot:activator="{ on, attrs }">
        <v-btn
            :color="section.menu.color" dark v-bind="attrs" v-on="on"
        >
            <template v-if="loader">
                    <v-progress-circular
                    indeterminate
                    size="34"
                    color="white"
                    ></v-progress-circular>
            </template>
            <template v-else>
                 <v-icon :left="section.menu.iconLeft" :right="section.menu.iconRight" >
                {{section.menu.icon}}
                </v-icon>
                <template v-if="propertyCurrent === ''">
                    {{section.menu.title}}
                </template>
                <template v-eslse >
                    {{propertyCurrent}}
                </template>
                
            </template>
        </v-btn>
        </template>

        <v-list>
        <v-list-item
            v-for="(item, i) in section.menu.options"
            :key="i"
            link
            @click="handlerMethod(item,item.method)"
        >
            <v-list-item-title class="d-flex align-center"  >
                {{ item.title }}
                <template v-if="item.icon" >
                    <v-icon class="mx-2">
                        {{ item.icon}}
                    </v-icon>
                </template>
            </v-list-item-title>
        </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import {mapState} from 'vuex'
import axiosInstance from '@/services/api/axiosInstance'
export default {
    props:['section','resources'],
    data(){
        return {
            loader : false,
            propertyCurrent:''
        }
    },
    methods:{
        handlerMethod(item,method){
            
            this[method](item)
        },
        async _getData(item){
            var valurProperty = item.value
            this.propertyCurrent = item.title
            this.loader = true
            this.$emit("setLoading", true)
            if(this.resources.api.globalParameters.hasOwnProperty('filter')){
                this.$emit("deleteProperty", "filter"); 
                this.$emit("cleanFilter");
            }
            // const url = this.resources.url.current
            const url = this.section.menu.url
            const globalParameters = this.resources.api.globalParameters
            const addParameters = { [this.resources.menu.property] : valurProperty }
            const dataRequest = {...globalParameters,...addParameters}
            this.$emit("setGlobalParameters",dataRequest)
          await  axiosInstance.get(url, {params : {  token:this.token, dataRequest}})
                .then(res => {
                    if (this.resources.pagination.display) {this.$pagination(res);}
                    this.$error('', 0, false);
                    this.$emit("setResponse",res.data.data)
                    })
                .catch(err => {
                    if(err.response.status === 404){
                      this.$error(err.response.data.error, 3000, true); this.$emit("setResponse",[]);
                    }
                })
                .finally(()=> {
                    this.loader = false
                    this.$emit("setLoading", false)
                   

                })
        },
        $pagination(res) {
            this.$emit("setCurrentPage", 1);
            this.$emit("setLastPage", res.data.last_page);
        },
        $error(msg, time, display) {
            const error = {
                display,
                text: msg,
                timeout: time,
                color: "error",
            };
            this.$emit("setError", error);
        },
    },
    computed : {...mapState('auth',['token']),}
    ,

}

</script>

