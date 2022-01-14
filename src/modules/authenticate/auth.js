import router from '../../router'
import axios from 'axios'
import axiosInstance from '@/services/api/axiosInstance'
export default{
    namespaced: true,
    state: {
        token : localStorage.getItem('auth') || '',
        userDB: '',
        auth : false,
        loadingGlobal : false,
        loadingBetweenRoutes: false
    },
    mutations:{
        setUser(state,payload){
            state.userDB = payload 
        },
        setAuth(state,payload){
            state.auth = payload
        },
        setToken(state,payload){
            if(payload !== ''){
                localStorage.setItem('auth',payload)
            }
            state.token = payload
        },
        clearToken(state){
            localStorage.remove('auth')
            state.token = '';
        },
        setLoadingGlobalWaitAuthenticate(state,payload){
            state.loadingGlobal = payload
        },
        setLoadingBetweenRoutesWaitAuthenticate(state,payload){
            state.loadingBetweenRoutes = payload
        },
        setFirstName(state,payload){
            state.userDB.firstName = payload
        },
        setLastName(state,payload){
            state.userDB.lastName = payload
        },
        setPhone(state,payload){
            state.userDB.phone = payload
        },
        setBirthDay(state,payload){
            state.userDB.birthday = payload
        },
        setGender(state,payload){
            state.userDB.gender = payload
        },
    },
    actions:{
        setUser({commit},payload){
            commit('setUser',payload.user)
            commit('setToken',payload.token)
            
        },
        setAuth({commit},payload){
            commit('setAuth',payload)
        },
        async readToken({commit},payload){
            commit('setLoadingGlobalWaitAuthenticate',true)
                const token = {
                    token : payload
                }
            await axiosInstance.post('/checkToken',token)
                        .then(res => {
                            commit('setLoadingGlobalWaitAuthenticate',false)
                            if(res.data.error === 'Unauthenticated'){
                                alert("Token invàlido")
                                if(localStorage.getItem('auth') !== null){
                                    localStorage.removeItem('auth')
                                }
                                return
                            }
                            commit('setUser',res.data.user)
                            commit('setAuth',true)
                        })
                        .catch(err => {
                            commit('setLoadingGlobalWaitAuthenticate',false)
                            console.log(err)
                            alert("dio error pq tenia algo en el localstorage. deberias borrarle el localstorage por este error. O verificar cuando dura el token")
                        })

        },
        async readTokenByLogin({commit,state},payload){
            const token = {
                token : payload
            }
        
                await axiosInstance.post('/checkToken',token)
                    .then(res => {
                        if(res.data.success){
                            router.push('/')
                    }
                       
                    })
                    .catch(err => {
                        console.log(err)
                    })
        },
        async logout({commit,state},payload){
            const token = {
                token : payload
            }
                await axiosInstance.post('/logout',token)
                    .then(res => {
                        
                       if(res.data.success){
                        localStorage.clear()
                       
                        commit('setUser','')
                        commit('setToken','')
                        commit('setAuth',false)

                        router.push('/')
                           
                       }
                    })
                    .catch(err => {
                        console.log(err)
                    })

        },
        loadingBeetwenRoutesWaitAuthenticate({commit},payload){
            commit('setLoadingBetweenRoutesWaitAuthenticate',payload)
        },
        loadingBeforeRouterIsNull({commit},payload){
            commit('setLoadingBetweenRoutesWaitAuthenticate',payload)
        },
        loadingGlobal({commit},payload){
            commit('setLoadingGlobalWaitAuthenticate',payload)
        }
        
    },
    
   
}