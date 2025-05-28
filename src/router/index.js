import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import Editor from '../components/Editor.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/editor', name: 'Editor', component: Editor },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
