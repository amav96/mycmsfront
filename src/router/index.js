import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import vuetify from "../plugins/vuetify";
import axiosInstance from '../services/api/axiosInstance'


Vue.use(VueRouter)
const routes = [
  {
    path: '/',name: 'Home',component: Home
  },
  {path: '/about',name: 'About',component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')},
  {path: '/login',name: 'Login',component: () => import(/* webpackChunkName: "Login" */ '../views/authenticate/Login.vue'), meta: {requiresVisitor: true},},
  {path: '/register',name: 'Register',component: () => import(/* webpackChunkName: "Register" */ '../views/authenticate/Register.vue'),meta: {requiresVisitor: true}},
  {path: '/registration/:token_validate',name: 'Registration',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/authenticate/ValidateCode.vue')},
  {path: '/restorePassword/:token_validate',name: 'RestorePassword',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/authenticate/RestorePassword.vue')},
  {path: '/resetPassword',name: 'ResetPassword',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/authenticate/ResetPassword.vue')},
  // ADMIN
  {path: '/panel',name: 'Admin',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/admin/dashboard/QuickStats.vue'),meta: {requireAdmin:true}},
  // ADMIN/USERS
  {path: '/usuarios',name: 'Users',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/admin/users/Users.vue'),meta: {requireAdmin:true}},
  // ADMIN/PRODUCTS
  {path: '/ventas/productos',name: 'Products',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/admin/products/Products.vue'),meta: {requireAdmin:true}},
  // CATEGORYS
  {path: '/categorias',name: 'Categories',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/admin/categories/Categories.vue'),meta: {requireAdmin:true}},
  
  // USERS
  {path: '/profile',name: 'Profile',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/users/Profile.vue'),meta: {requireUserActive:true}},
  {path: '/profile/password',name: 'Password',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/users/Password.vue'),meta: {requireUserActive:true}},
  {path: '/profile/name',name: 'Name',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/users/Name.vue'),meta: {requireUserActive:true}},

  //LOGOUT

  {path: '/salir',name: 'Logout',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/users/Logout.vue'),meta: {requireUserActive:true}},

  {path :'*',component: () => import(/* webpackChunkName: "Dashboard" */ '../views/helpers/NotFound.vue')},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // la pagina la pone al top de todo al cambiar de vista
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
   if (to.matched.some(record => record.meta.requiresVisitor)) {
    
   //cuando entro al login verifico todo esto
   if(vuetify.framework.breakpoint.width < 420){
      store.commit('SET_DRAWER', false)
    }
      const getToken = localStorage.getItem('auth')
        if(getToken !== null){
              const token = {
                  token : getToken
              }
          axiosInstance.post('/checkToken',token)
              .then(res => {
                store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',false)
                // store.dispatch('auth/loadingAuthenticate',false)
                  if(res.data.success){
                    if(res.data.user.status === 'baneado'){
                      localStorage.removeItem('auth')
                      next('/login');
                      return
                    }
                    next('/');
                  }else {
                    next();
                  }
              })
              .catch(err => {
                store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',false)
                console.log(err)
              next('/');
              })

              return
        }
        store.dispatch('auth/loadingGlobal',false)
        next();
  }
    else if (to.matched.some(record => record.meta.requireAdmin)){
    if(vuetify.framework.breakpoint.width < 420){
      store.commit('SET_DRAWER', false)
    }
    
       store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',true)
       const getToken = localStorage.getItem('auth')
        if(getToken !== null){
              const token = {
                  token : getToken
              }
            axiosInstance.post('/checkToken',token)
              .then(res => {
             
                 store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',false)
                  if(res.data.success){
                      if(res.data.user.status === 'baneado'){
                        localStorage.removeItem('auth')
                        next('/login');
                        return
                      }
                      if(res.data.user.role !== 'administrador' && res.data.user.role !== 'vendedor'){
                        next('/');
                      }
                    store.dispatch('auth/setUser',{user:res.data.user,token:res.data.token})
                    next();
                  }else {
                    next('/');
                  }
              })
              .catch(err => {
                store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',false)
              next('/');
              })
        }else{ next('/');}
  } else if (to.matched.some(record => record.meta.requireUserActive)){
    if(vuetify.framework.breakpoint.width < 420){
      store.commit('SET_DRAWER', false)
    }
    
       store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',true)
      
       const getToken = localStorage.getItem('auth')
        if(getToken !== null){
              const token = {
                  token : getToken
              }
            axiosInstance.post('/checkToken',token)
              .then(res => {
                 store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',false)
                  if(res.data.success){
                      if(res.data.user.status === 'baneado'){
                        localStorage.removeItem('auth')
                        next('/login');
                        return
                      }
                      if(res.data.user.status !== 'activo'){
                        next('/');
                      }
                      store.dispatch('auth/setUser',{user:res.data.user,token:res.data.token})
                    next();
                  }else {
                    next('/');
                  }
              })
              .catch(err => {
                store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',false)
              next('/');
              })
        }else{ next('/');}
  } else {

        store.commit('SET_DRAWER', false)
        const getToken = localStorage.getItem('auth')
        if(getToken !== null){
              const token = {
                  token : getToken
              }
            store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',true)
            axiosInstance.post('/checkToken',token)
              .then(res => {
                  store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',false)
                  if(res.data.success){
                      if(res.data.user.status === 'baneado'){
                        localStorage.removeItem('auth')
                        next('/login');
                        return
                      }
                      store.dispatch('auth/setUser',{user:res.data.user,token:res.data.token})
                  }else {
                    next('/');
                  }
              })
              .catch(err => {
                store.dispatch('auth/loadingBeetwenRoutesWaitAuthenticate',false)
              next('/');
              })
        }
    next();
  }
});




export default router
