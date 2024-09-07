import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue' 
import Auth from '@/components/Auth.vue' 
import Film from '@/components/Film.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { 
        title : "Pellicule - Accueil",
        requiresAuth: true
       }
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      meta: { 
        title : "Pellicule - Authentification",
        requiresAuth: false
       }
    },
    {
      path: '/movies',
      name: 'movies',
      component: Film,
      meta: { 
        title : "Pellicule - Films",
        requiresAuth: true
       }
    },
  ]
});

router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth) {
    if (! JSON.parse(sessionStorage.getItem('tokenMovies'))) {
      return { name: 'auth' };
    }
  }
});

export default router;