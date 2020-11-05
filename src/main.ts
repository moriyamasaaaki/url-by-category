import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/auth';


Vue.config.productionTip = false;

const firebaseConfig: any = {
  apiKey: 'AIzaSyArlVCKWMjKJk4qBIh2LS7gzpbgbJOpEE4',
  authDomain: 'url-by-category.firebaseapp.com',
  databaseURL: 'https://url-by-category.firebaseio.com',
  projectId: 'url-by-category',
  storageBucket: 'url-by-category.appspot.com',
  messagingSenderId: '980291992511',
  appId: '1:980291992511:web:b88e59d7dd0b374310bf0a',
  measurementId: 'G-VFP48F95PB',
};

firebase.initializeApp(firebaseConfig);


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
