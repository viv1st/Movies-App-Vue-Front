<script setup>
import { ref } from 'vue';

</script>

<template>
  <div class="home background">
    <header class="text-center" style="margin-top : 80px;">
        <img src="@/assets/pellicule.png" width="100px" height="100px"/>
    </header>
    
    <main class="content">
      <h1 class="main-title">Films et séries en illimité,<br>et bien plus encore</h1>
      <h2 class="sub-title">Découvrez les dernières nouveautés !</h2>
    </main>
  </div>
</template>

<style scoped>
/* Réinitialisation des styles pour éviter les marges et paddings par défaut */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Empêche le défilement de la page */
}

#app {
  height: 100%;
}

.home {
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.logo {
  height: 50px;
}

.content {
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
  padding: 0 20px;
  z-index: 1;
}

.main-title {
  font-size: 4rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
}

.sub-title {
  font-size: 2rem;
  font-weight: normal;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .sub-title {
    font-size: 1.5rem;
  }
}

.background {
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.8) 100%), url("@/assets/netflix-background.jpg");
}
</style>
