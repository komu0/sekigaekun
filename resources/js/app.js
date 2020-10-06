require('./bootstrap');
// ルーティングの定義をインポートする
import router from './router'
// ルートコンポーネントをインポートする
import App from './App.vue'

import Vue from 'vue'

new Vue({
  el: '#app',
  router, // ルーティングの定義を読み込む
  components: { App }, // ルートコンポーネントの使用を宣言する
  template: '<App />' // ルートコンポーネントを描画する
  
//   つまりどういうことかというと、
//   index.blade.php内の<div id="app"></div>が<App />になり、それがコンポーネントになる。
//   { App }はApp.vueということだから、App.vueに置き換わるということ。
})