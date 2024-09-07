<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useRouter } from 'vue-router';

const routerApp = useRouter()

// const signOutCustom = () => {
//   auth.signOut()
//   routerApp.push('auth')
// }
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="row text-center">
        <div class="col">
          <RouterLink to="/">Home</RouterLink>
        </div>
        <div class="col">
          <RouterLink to="movies">Les Films</RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 80px;
  align-items: center;
  padding: 10px 30px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.logo {
  width: 100px;
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #e50914;
}

nav a.router-link-exact-active {
  font-weight: bold;
  color: #e50914;
}
</style>
