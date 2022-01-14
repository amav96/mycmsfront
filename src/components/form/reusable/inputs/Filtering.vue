<template>
  <v-text-field
    v-model="data"
    :dense="resources.filter.dense"
    :outline="resources.filter.outline"
    :solo="resources.filter.solo"
    :clearable="resources.filter.clearable"
    :label="resources.filter.label"
    :color="resources.filter.color"
    text
    error
    :loading="loader"
  ></v-text-field>
</template>

<script>
import { mapState } from "vuex";
import axiosInstance from '@/services/api/axiosInstance'
export default {
  props: ["resources"],
  data() {
    return {
      data: "",
      awaitingSearch: false,
      loader: false,
      dataRequest: [],
      cache: {
        url: "",
        active: false,
      },
      cleanExterior : false
    };
  },
  methods: {
    async tryFilter() {
      if (!this.cache.active) {
        this.cache.url = this.resources.url.current;
        this.cache.active = true;
      }
      const url = this.resources.filter.url;
      const globalParameters = this.resources.api.globalParameters;
      const addParameters = { filter: this.data };
      const dataRequest = { ...globalParameters, ...addParameters };
      this.dataRequest = dataRequest;
      this.$emit("setGlobalParameters", this.dataRequest);
      this.loader = true;
      this.$emit("setLoading", true);
      await axiosInstance
        .get(url, {
          data: {},
          params: {
            token: this.token,
            dataRequest: JSON.stringify(dataRequest),
          },
        })
        .then((res) => {
          if (this.resources.pagination.display) {this.$pagination(url, res);}
          this.$error('', 0, false);
          this.$emit("setResponse", res.data.data);
        })
        .catch((err) => {
          if(err.response.status === 404 || err.response.status === 400)
            this.$error(Object.values(err.response.data)[0], 3000, true); 
            this.$emit("setResponse", []);
            return;
        })
        .finally(() => {
          this.loader = false;
          this.$emit("setLoading", false);
        })
    },
    resetFilter() {
  
      this.$emit("deleteProperty", "filter");
      this.$emit("setUrlCurrent", this.cache.url);
      this.$emit("updateData");
      this.$error('', 0, false);
      this.cache.active = false;
    },
    $pagination(url, res) {
      this.$emit("setUrlCurrent", url);
      this.$emit("setCurrentPage", 1);
      this.$emit("setLastPage", res.data.last_page);
    },
    $error(msg, time, display) {
      const error = {
        display,
        text: msg,
        timeout: time,
        color: "error",
        filter: true,
        slug: this.data
      };
      this.$emit("setError", error);
    },
    cleanFilter(){
      this.cleanExterior = true
      this.$nextTick(()=>{
        this.data = ""
        this.cleanExterior = false
      })
    }
  },
  watch: {
    data(val) {
      if (val === "" || val === null) {
       
        if(!this.cleanExterior){
          this.resetFilter();
        }
            
      } else {
        if (!this.awaitingSearch) {
          setTimeout(() => {
            if (this.data !== "") {
              this.tryFilter();
            }
            this.awaitingSearch = false;
          }, 1000); // 1 sec delay
        }
        this.awaitingSearch = true;
      }
    },
  },
  computed: { ...mapState("auth", ["token"]) },
};
</script>
