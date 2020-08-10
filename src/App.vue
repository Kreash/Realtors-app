<template>
  <v-app>
    <home-layout>
      <router-view/>
    </home-layout>



  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import HomeLayout from '@/layouts/Home-layout.vue'

export default Vue.extend({
  name: 'App',

  components: {
    HomeLayout
  },

  data: () => ({
    //
  }),
});
</script>
