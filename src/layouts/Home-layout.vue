<template>
<v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <router-link 
        v-for="link in links"
        :key="link.url"
        tag="div"
        :to="link.url"
        >
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{link.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Realtors App</v-toolbar-title>

      <v-text-field
        placeholder="Поиск риэлтора"
        v-model="search"
        solo
        dense
        hide-details
      ></v-text-field>

      <router-link 
      tag="div"
      to="/realtors-list"
      >
        <v-btn @click="searchRealtor()" icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </router-link>

      <!-- <v-text-field  label="Поиск" class="mx-1"></v-text-field> -->


    </v-app-bar>

    <v-main>
      <v-container
        class="fill-height"
        fluid
      >

      <router-view/>

      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { bus } from '@/service/bus.ts';
export default Vue.extend({
  props: {
    source: String,
  },
  data: () => ({
    search: '',
    drawer: null,
    links: [
      {title: 'Главное меню', url: '/'},
      {title: 'Список риэлторов', url: '/realtors-list'},
      {title: 'Новый риэлтор', url: '/realtor-create'},
    ]
  }),
  created () {
    this.$vuetify.theme.dark = true
  },
  methods: {
    searchRealtor() {
      setTimeout(() => {
        bus.$emit('searchRealtor', this.search)
        this.search='';
      }, 100);
    }
  }
})
</script>