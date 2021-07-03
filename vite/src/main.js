import {
  str
} from './moduleA.js';
import {
  createApp,
} from 'vue';
import App from './app.vue';
import './index.css'

createApp(App).mount('#app')
console.log(str, 'hello')