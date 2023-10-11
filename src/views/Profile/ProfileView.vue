<script setup>
import Profile from '../../components/Profile/Profile.vue';
</script>
<template>
    <div>
        <Profile :key="$route.params.username"/>
    </div>
</template>