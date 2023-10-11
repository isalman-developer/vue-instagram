<script setup>
import { defineProps } from 'vue';
const props = defineProps(["post"]);
const {VITE_BASE_PHOTO_URL} = import.meta.env
</script>

<template>
  <ACard hoverable style="width: 20%" class="card">
    <template #cover>
      <img alt="example"
        :src="`${VITE_BASE_PHOTO_URL}${props.post.url}`" />
    </template>
    <ACardMeta :title="props.post.username">
      <template #description>{{ props.post.caption }}</template>
    </ACardMeta>
  </ACard>
</template>

<style scoped>
.card {
  margin-top: 30px;
}
</style>