<template>
         <div >
            <v-autocomplete
            v-model.trim="select"
            ref="autocomplete"
            :color="customClass.color"
            :class="customClass.class"
            :loading="loading"
            :items="items"
            item-text="name"
            item-value="id"
            :search-input.sync="search"
            cache-items
            :outlined="customClass.outlined"
            :dense="customClass.dense"
            :label="title"
            flat
            return-object
            :disabled="searchID === ''"
            > 
        </v-autocomplete>
        </div>
</template>

<script>
import axiosInstance from '@/services/api/axiosInstance'
export default {
     props: {
        url: {
            type: String
        },
        title: {
            type: String
        },
        token:{
          type: String
        },
        searchID: {
            type: String
        },
        customClass:{
            type: Object
        },
        reassign:{
            type: Number
        },
        
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
     methods: {
        getDataByID() {
            
            if(this.searchID !== '' && this.searchID !==null){
                const url = this.url
                axiosInstance.get(url, {
                        params: {
                            token:this.token,
                            id: this.searchID
                        }
                    })
                    .then(res => {
                        if (res.data.error) {
                            return
                        }
                        const data = res.data
                        this.items = data
                        this.data = data

                        if(this.reassign !== '' && this.reassign !== undefined){
                            this.$reassingData()
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })

            }
        },
        clearCachedItems() {
            this.$refs.autocomplete.cachedItems = [];
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
        returnData(val) {
            this.$emit("exportVal", val)
        },
        c_reset() {
            this.items = []
            this.data = []
            this.search = null
            this.select = null
        },
        $reassingData() {
                if(this.reassign !== '' && this.reassign !== undefined){
                    const arr = JSON.parse(JSON.stringify(this.data))
                    var find;
                    if(this.reassign.type && this.reassign.type === 'id'){
                         find = arr.filter(item => item.id === this.reassign)
                    }else if(this.reassign.type && this.reassign.type === 'slug'){
                         find = arr.filter(item => item.slug === this.reassign)
                    }else{
                         find = arr.filter(item => item.id === this.reassign)
                    }
                    this.select = find[0]
                }
        }
    },
     watch: {
        search(val) {
            val && val !== this.select && this.querySelections(val)
        },
        select(val) {

            val && this.returnData(val)
        },
        searchID(NewVal, oldVal) {
            if (oldVal !== '' && NewVal !== oldVal) {
                this.clearCachedItems();
            }
            if (NewVal !== '') {
                this.getDataByID()
            }
        },
        reassign(val){
            this.$reassingData()
        }

    },
    created(){
        this.getDataByID()
    },
    
    

}
</script>

