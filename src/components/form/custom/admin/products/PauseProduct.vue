<template>
  <div>
      <Confirm 
      :content="pauseProduct"
      @setContinue="_handlerContinue($event)"
      />
  </div>
</template>

<script>
import Confirm from '@/components/form/reusable/forms/Confirm'
import axiosInstance from '@/services/api/axiosInstance'
 import {mapState,mapActions} from 'vuex'
export default {
    components:{
        Confirm
    },
    props:["pauseProduct"],
    data(){
        return {

        }
    },
    methods:{
        _handlerContinue(flag){
            if(flag){
                this.$emit('setLoading', false);
                const url = this.pauseProduct.url
                axiosInstance.post(url,{
                        token:this.token,
                        id:this.pauseProduct.data.id,
                        _method: 'patch'
                    
                })
                .then(res => {
                        const snackbar = {display:true,text:'Pausado correctamente',timeout:5000,color:'success'}
                        this.$emit('setMsg',snackbar);
                        this.$emit('updateData',snackbar);
                })
                .catch(err => {
                    if(err.response.status === 400 || err.response.status === 500 || err.response.status === 404){
                        if(err.response.data.id){
                                var snackbar = {display:true,text:err.response.data.id[0],timeout:5000,color:'error'}
                        }else{  var snackbar = {display:true,text:err.response.data.error,timeout:5000,color:'error'}}
                        this.$emit('setMsg',snackbar);
                    }
                   
                })
                .finally(()=>{
                    this.$emit('setLoading', false);
                    this.$emit('closeContinue', false);
                })

            }else{
                this.$emit('closeContinue', false);
            }
            
        }
    },
    computed: {
         ...mapState('auth',['token']),
    }
}
</script>

<style>

</style>