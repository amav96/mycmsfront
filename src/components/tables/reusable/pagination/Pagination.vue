<template>
  <div class="mx-2">
    <v-pagination
      color="info"
      v-model="page"
      class="my-4"
      :length="resources.pagination.last_page"
      @input="paginate"
      :disabled="isDisabled"
    ></v-pagination>
  </div>
</template>

<script>
import axiosInstance from '@/services/api/axiosInstance'
export default {
  props: ["resources", "token"],
  data() {
    return {
      page: 1,
    };
  },
  methods: {
    paginate() {
      this.$emit("setLoading", true);
      const dataRequest = this.resources.api.globalParameters;
      axiosInstance.get(this.resources.url.current + "?page=" + this.page, {
          data: {},
          params: {
            token: this.token,
            dataRequest: JSON.stringify(dataRequest),
          },
        })
        .then((res) => {
          // setTimeout(() => {
            
          
          this.$emit("setLoading", false);
         
          if(res.data.data.length === 0){
            if(this.page > 1){
                this.$nextTick(()=>{
                  this.paginate()
                  console.log("hey")
                })
                return false
            }else{
              this.$error('No hay mas resultados para mostrar', 3000, true);
              console.log("s")
              return
            }
          }
          this.$emit("setLastPage", res.data.last_page);
          this.$emit("setResponse", res.data.data);
          // }, 2000);
        })
        .catch((err) => {
          if(err.response.status === 404){

             const msg = {
              display: true,
              text: err.response.data.error,
              timeout: 3500,
              color: "error",
              };
          console.log(msg)
          this.$emit("setError", msg);
          this.$emit("setResponse", []);

          }
            console.log(err.response)
        
          

        })
        .finally(()=> {
          this.$emit("setLoading", false);
        })
    },
     $error(msg, time, display) {
      const error = {
        display,
        text: msg,
        timeout: time,
        color: "error",
      };
      // this.$emit("setError", error);
      this.$emit("setErrorInfo", error)
    },
  },
  watch: {
    page(val) {
      this.$emit("setCurrentPage", val);
    },
    currentPage(val) {
      this.page = val;
    },
  },
  computed: {
    currentPage() {
      return this.resources.pagination.current_page;
    },
    isDisabled(){
      if(this.resources.data.response.length < 1){
        return true
      }else{
        return false
      }
      
    }
  },
};
</script>

