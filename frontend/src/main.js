import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { apiUrl, googleClientId, githubClientId } from "./config";

console.log(apiUrl);
console.log(googleClientId);
console.log(githubClientId);


createApp(App).mount('#app')
