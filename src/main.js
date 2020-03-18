import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import * as firebase from 'firebase';

// Required for side-effects
// require("firebase/firestore");
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBZif--14vshmSp7e5gcfGuG-VwjRtjOVc",
    authDomain: "vuechat-1f005.firebaseapp.com",
    databaseURL: "https://vuechat-1f005.firebaseio.com",
    projectId: "vuechat-1f005",
    storageBucket: "vuechat-1f005.appspot.com",
    messagingSenderId: "909069178951",
    appId: "1:909069178951:web:e4b594a5162733dade7962"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// var db = firebase.firestore();
// window.db = db;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
