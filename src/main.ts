import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import { firebaseConfig } from '@/firebase-config.ts'

import firebase from 'firebase/app';
import 'firebase/database';

Vue.config.productionTip = false

// Файл с настройками firebase добавлен в .gitignore файл.
firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
