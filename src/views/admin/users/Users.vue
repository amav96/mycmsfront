<template>
  <v-app class="app">
    
    <DrawerAdmin />
    <v-container>
      <div>
        <div class="mx-2">
          <v-breadcrumbs class="px-2" :items="items">
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </div>

        <template v-if="users.display">
          <div class="d-flex justify-end mx-2 my-2">
            <Menu
              :section="users"
              :resources="RESOURCES"
              @setError="RESOURCES.error.alert = $event"
              @setGlobalParameters="RESOURCES.api.globalParameters = $event"
              @deleteProperty="deleteProperty($event)"
              @cleanFilter="cleanFilter($event)"
              @setLastPage="RESOURCES.pagination.last_page = $event"
              @setCurrentPage="RESOURCES.pagination.current_page = $event"
              @setResponse="RESOURCES.data.response = $event"
              @deleteParameter="RESOURCES.api.deleteParameter = $event"
              @setLoading="RESOURCES.loaders.linear = $event"
            />
          </div>
        </template>

        <template v-if="this.RESOURCES.loaders.linear">
          <div class="mx-2">
            <!-- <v-progress-linear color="info" indeterminate></v-progress-linear> -->
            <v-overlay  color="white">
                      <v-progress-circular
                        indeterminate
                        size="64"
                        color="info"
                      ></v-progress-circular>
            </v-overlay>
          </div>
        </template>
        <template v-if="showFilter">
          <div class="mx-2 mt-3">
            <Filtering
              :resources="RESOURCES"
              @setError="RESOURCES.error.alert = $event"
              @setGlobalParameters="RESOURCES.api.globalParameters = $event"
              @deleteProperty="deleteProperty($event)"
              @setLastPage="RESOURCES.pagination.last_page = $event"
              @setCurrentPage="RESOURCES.pagination.current_page = $event"
              @setResponse="RESOURCES.data.response = $event"
              @setUrlCurrent="RESOURCES.url.current = $event"
              @updateData="updateData($event)"
              ref="refFilter"
            />
          </div>
        </template>

        <template v-if="RESOURCES.error.alert.display">
          <v-alert border="right" colored-border type="error" elevation="2" class="mt-0 mb-3 mx-2">
            <template v-if="RESOURCES.error.alert.filter">
              {{ RESOURCES.error.alert.text }} para <strong>({{RESOURCES.error.alert.slug}}).</strong>
            </template>
            <template v-else>
                {{ RESOURCES.error.alert.text }}
            </template>
          </v-alert>
        </template>

        <template v-if="showTable">
          <div class="mx-2">
            <TableUser @setError="RESOURCES.snackbar = $event" :resources="RESOURCES" @updateData="updateData($event)" />
          </div>
        </template>

        <template v-if="showPaginate">
          <div v-show="this.RESOURCES.data.response.length > 0">
            <Pagination
              :token="token"
              :resources="RESOURCES"
              @setError="RESOURCES.snackbar = $event"
              @setLastPage="RESOURCES.pagination.last_page = $event"
              @setCurrentPage="RESOURCES.pagination.current_page = $event"
              @setResponse="RESOURCES.data.response = $event"
              @setLoading="RESOURCES.loaders.linear = $event"
              ref="refPagination"
            />
          </div>
        </template>
      </div>

      <Snackbar :snackbar="RESOURCES.snackbar" />
    </v-container>
  </v-app>
</template>

<script>
import Menu from "@/components/menu/reusable/Menu";
import AppBar from "@/components/core/AppBar";
import DrawerAdmin from "@/components/core/DrawerAdmin";
import TableUser from "@/components/tables/custom/users/TableUser";
import Pagination from "@/components/tables/reusable/pagination/Pagination";
import Snackbar from "@/components/message/Snackbar";
import Filtering from "@/components/form/reusable/inputs/Filtering";
import { mapState } from "vuex";
import axiosInstance from '@/services/api/axiosInstance'

export default {
  components: {
    AppBar,
    DrawerAdmin,
    TableUser,
    Menu,
    Pagination,
    Snackbar,
    Filtering,
  },
  data() {
    return {
      items: [
        {
          text: "Usuarios",
          disabled: false,
          href: "",
        },
      ],
      users: {
        display: true,
        pagination: {
          display: true,
          current_page: 0,
          last_page: 0,
          limit: 7,
        },
        export: {},
        filter: {
          display: true,
          dense: false,
          outline: false,
          solo: true,
          clearable: true,
          label: "Buscar",
          color: "info",
          url: "/users/filter",
        },
        select: {
          url: "",
        },
        table: {
          display: false,
          columns: [
            { text: "id" },
            { text: "Nombre" },
            { text: "Apellido" },
            { text: "Documento" },
            { text: "Email" },
            { text: "Rol" },
            { text: "Estado" },
            { text: "Fecha" },
            { text: "Ult Actualzaciòn" },
            { text: "Acciòn" },
          ],
        },
        menu: {
          color: "light-blue",
          iconLeft: true,
          iconRight: false,
          icon: "mdi-filter",
          title: "Estado",
          options: [
            { title: "Todos",icon:'mdi-notification-clear-all', value: "all", method: "_getData" },
            { title: "Activo",icon:'mdi-account-check-outline', value: "activo", method: "_getData" },
            {
              title: "Esperando validar mail",
              icon:'mdi-email-sync-outline',
              value: "esperando_validar",
              method: "_getData",
            },
            { title: "Baja voluntaria",icon:'mdi-arrow-down', value: "baja_voluntaria", method: "_getData" },
            { title: "Suspendidos",icon:'mdi-account-cancel-outline', value: "baneado", method: "_getData" },
          ],
          property: "status",
          url: "/users",
        },
        url: {
          current: "/users",
        },
      },
      RESOURCES: {
        loaders: {
          circular: false,
          linear: false,
        },
        // CUANDO LOADING ES TRUE ES PORQUE HAY PATICIONES EN CURSO
        loading: false,
        data: {
          response: [],
          auxResponse: [],
        },
        snackbar: {},
        api: {
          globalParameters: [],
        },
        error: {
          alert: {
            display: false,
            text: "",
          },
        },
      },
    };
  },
  methods: {
    _getUser() {
      const url = this.users.url.current;
      this.RESOURCES.loaders.linear = true;
      var dataRequest = { limit: this.users.pagination.limit };
      this.RESOURCES.api.globalParameters = dataRequest;
      axiosInstance.get(url, {
          params: {
            token: this.token,
            dataRequest: dataRequest,
          },
        })
        .then((res) => {
         
          this.RESOURCES.loaders.linear = false;
          if (res.data.error === "Unauthenticated") {
            return this.$router.push("/");
          }
          if (res.data.error) {
            alert(res.data.error);
            this.RESOURCES.data.response = [];
            this.RESOURCES.table.display = false;
            return;
          }
          this.RESOURCES.pagination.last_page = res.data.last_page;
          this.RESOURCES.data.response = res.data.data;
          this.RESOURCES.table.display = true;
        })
        .catch((err) => {
          this.RESOURCES.loaders.linear = false;
          console.log(err);
        });
    },
    assignSection() {
      Object.assign(this.RESOURCES, this.users);
    },
    updateData() {
      this.$refs.refPagination.paginate();
    },
    deleteProperty(property) {
      this.$delete(this.RESOURCES.api.globalParameters, property);
    },
    cleanFilter(){
      this.$refs.refFilter.cleanFilter();
      
    }
  },
  computed: {
    ...mapState("auth", ["token"]),
    showPaginate() {
      if (
        this.RESOURCES.data.response !== undefined &&
        this.RESOURCES.table.display &&
        this.RESOURCES.pagination.display &&
        this.RESOURCES.data.response.length > 0
        || this.showFilter
      ) {
        return true;
      } else {
        return false;
      }
    },
    showTable() {
      if (this.RESOURCES.data.response !== undefined && this.RESOURCES.table.display  && this.RESOURCES.data.response.length > 0) {
        return true;
      } else {return false;}
    },
    showFilter(){
      if (this.RESOURCES.filter.display) {
        return true;
      } else { return false;}
    }
  },
  created() {
    this.assignSection();
    this.$nextTick(() => {
      this._getUser();
    });
  },
};
</script>