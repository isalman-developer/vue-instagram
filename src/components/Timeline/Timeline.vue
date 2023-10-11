<script setup>
import Container from '../UI/Container.vue';
import { useUserStore } from '../../stores/user';
import { storeToRefs } from 'pinia';
import TimelineCards from '../TimelineCards/TimelineCards.vue';
import LoginMessage from '../LoginMessage/LoginMessage.vue'


const userStore = useUserStore();
const { user, loadingUser } = storeToRefs(userStore);
</script>
<template>
    <div>
        <Container>
            <div v-if="!loadingUser">
                <TimelineCards v-if="user"/>
                <LoginMessage v-else/>
            </div>
            <div v-else class="spinner">
                <ASpin />
            </div>
        </Container>
    </div>
</template>

<style scoped>
.timeline-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}
</style>