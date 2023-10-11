<script setup>
import { onMounted } from 'vue';
import Nav from './components/Nav/Nav.vue';
import { RouterView } from 'vue-router';
import { useUserStore } from './stores/user';

const userStore = useUserStore();
onMounted(() => {
  userStore.getUser()
})
</script>

<template>
  <main>
    <Nav />
    <RouterView/>
  </main>
</template>

<style scoped></style>