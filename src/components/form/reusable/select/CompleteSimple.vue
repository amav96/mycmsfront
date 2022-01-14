<template>
  <div>
        <br>
        <v-autocomplete
        v-model="select"
        :loading="loading"
        :items="items"
        item-text="slug"
        item-value="id"
        :search-input.sync="search"
        cache-items
        :label="title"
        flat
        color="info"
        return-object
        > 
        
    </v-autocomplete>
    </div>
</template>

<script>
import axiosInstance from '@/services/api/axiosInstance'
export default {
  props: {
        url:{
          type: String
        },
        title: {
            type: String
        },
        token:{
          type: String
        },
        reassign:{
            type: Number
        }
    },
  data() {
        return {
            loading: false,
            items: [],
            search: null,
            select: null,
            data: [],
        }
    },
     watch: {
        search(val) {
            val === '' ? this.items = this.data : false
            val && val !== this.select && this.querySelections(val)
        },
        select(val) {
            val && this.$returnData(val)
        },
        
    },
    methods: {
        getData() {
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

                    const data = res.data
                    this.items = data
                    this.data = data
                    
                    this.reassign !== '' && this.reassign !== undefined && this.reassign > 0
                    ? this.$reassingData()
                    : false;
                   
                })
                .catch(err => {
                    console.log(err)
                })
        },
        querySelections(val) {
            this.loading = true
                // Simulated ajax query
            setTimeout(() => {
                const arr = JSON.parse(JSON.stringify(this.data))
                this.items = arr.filter(item => item.slug.toLowerCase().indexOf(val.toLowerCase()) !== -1);
                this.loading = false
            }, 500)
        },
        clearCachedItems() {

            this.$refs.autocomplete.cachedItems = [];
        },
        $returnData(val) {
            this.$emit("exportVal", val)
        },
        $reassingData() {
            const arr = JSON.parse(JSON.stringify(this.data))
            if(this.reassign.type && this.reassign.type === 'id'){
                this.items = arr.filter(item => item.id === this.reassign)
            }else if(this.reassign.type && this.reassign.type === 'slug'){
                this.items = arr.filter(item => item.slug === this.reassign)
            }else{
                this.items = arr.filter(item => item.id === this.reassign)
            }
            
            this.select = this.items[0]
        }
    },
    created() {
        
        this.getData()
    },
   
}
</script>

<style>

</style>