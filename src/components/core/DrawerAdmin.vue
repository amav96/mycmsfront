<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    mobile-breakpoint="960"
    app
    width="260"
   
  >
  <!-- INFO USUARIO -->
    <v-divider class="mb-1" />
    
    <v-list
      dense
      nav
    >
      <v-list-item>
        <v-list-item-avatar
          class="align-self-center"
          color="white"
          contain
        >
          <v-img
            src="http://mycms.test/images/logo/logo.png"
            max-height="30"
          />
        </v-list-item-avatar >

        <v-list-item-content>
          <v-list-item-title
            v-text="profile.title"
          />
          <span class="black--text" >{{userDB.firstName}} {{userDB.lastName}}</span>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <!-- INFO USUARIO aca terminal la informacion del usuario -->
    <v-divider class="mb-2 mt-3" />

    <v-list
      expand
      nav
    >
        <div
        v-for="item in menu"
        :key="item.title"
        >
          <template v-if="item.items.length>0" >
            
            <v-list-group
            no-action
            color="white"
            >
            
              <template v-slot:activator>
              <v-icon :class="activeLinkMain(item) ? 'force-text-info mx-3 mr-6' : 'mx-3 mr-6'" >
               {{item.icon}}
              </v-icon>
                <v-list-item-content >
                  <v-list-item-title  :class="activeLinkMain(item) ? 'force-text-black' : ''" v-text="item.title"></v-list-item-title>
                </v-list-item-content>
                
              </template>

                <v-list-item 
                  v-for="child in item.items"
                  :key="child.title"
                  :to="child.to"
                  
                >
                  <v-list-item-content   >
                    <v-list-item-title   v-text="child.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
            </v-list-group>
          </template>

          <template v-else >

            <v-list-item-group
            color="info"
            
            >
          <v-list-item  :to="item.to" >
            <v-list-item-icon>
              <v-icon v-text="item.icon"
              ></v-icon>
            </v-list-item-icon>

            <v-list-item-content >
              <v-list-item-title  v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
          </template>
        </div>
    
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import {mapState} from 'vuex'
  export default {

    data: () => ({
      menu: [
        {
          icon: 'mdi-home',
          title: 'Inicio',
          items: [],
          to: '/',
        },
        {
          icon: 'mdi-view-dashboard',
          title: 'Panel',
          items: [],
          to: '/panel',
        },
        {
          icon: 'mdi-account',
          title: 'Usuarios',
          items: [],
          to: '/usuarios',
        },
        {
          icon: 'mdi-store',
          title: 'Ventas',
          items: [
            { title: 'Productos', to : '/ventas/productos' },
            ],
          to: '',
          main:'ventas'
        },
        {
          icon: 'mdi-bookmark-multiple-outline',
          title: 'Categorias',
          items: [],
          to: '/categorias',
        },
        {
          icon: 'mdi-account',
          title: 'Mis datos',
          items: [],
          to: '/profile',
        },
        {
          icon: 'mdi-exit-to-app',
          title: 'Salir',
          items: [],
          to: '/salir',
        },
      ],
    }),

    computed: {
      ...mapState('auth',['userDB'],['barColor', 'barImage']),
      drawer: {
        get () {
          return this.$store.state.drawer
        },
        set (val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems () {
        return this.items.map(this.mapItem)
      },
      profile () {
        
        return {
          avatar: true,
          title: this.userDB.name,
        }
      },
    },
    methods:{
      activeLinkMain(item){
        var routeParent = this.$route.fullPath.split('/')[1]
        var value = false;
        if(routeParent === item.main.toLowerCase()){
          value = true;
        }else {
          value  = false
        }
        return value;
      },
      activeLinkSingle(item){
        console.log(item)
      }
    }
  }
</script>
<style scopedSlots>
.force-text-white{
  color: white !important;
}
.force-text-info{
  color: #2196f3 !important;
}
.force-text-black{
  color: black !important;
}
.v-list .v-list-item {
   
     color: rgb(94, 88, 88) !important;
}
.v-list .v-list-item--active {
    background-color: white !important;
   
}

.v-list .v-list-item--active .v-list-item__title {
    background-color: white !important;
    color: black !important;
}

.v-list .v-list-item--active .v-icon {
    color: #2196f3 !important;
}



</style>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
</style>
