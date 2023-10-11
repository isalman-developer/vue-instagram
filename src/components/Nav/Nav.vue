<script setup>
import { RouterLink, useRouter } from "vue-router"
import Container from '../UI/Container.vue';
import AuthModal from "../AuthModal/AuthModal.vue";
import { useUserStore } from "../../stores/user";
import { ref } from "vue";
import { storeToRefs } from "pinia";

const router = useRouter()
const userStore = useUserStore()
const searchUsername = ref("")

const { user, loadingUser } = storeToRefs(userStore);

const onSearch = () => {
    if (searchUsername.value) {
        router.push(`/profile/${searchUsername.value}`)
        searchUsername.value = "";
    }
}

const handleLogout = async () => {
    await userStore.handleLogout()
}

const goToUsersProfile = () => {
    router.push(`/profile/${user.value.username}`)
}
</script>

<template>
    <ALayoutHeader style="background-color: black; padding: 10px;">
        <Container>
            <div class="nav-container">
                <div class="left-content">
                    <RouterLink to="/"> Instagram</RouterLink>
                    <AInputSearch v-model:value="searchUsername" placeholder="Username..." style="width: 200px;"
                        @search="onSearch" />
                </div>
                <div v-if="!loadingUser" class="content">
                    <div class="right-content" v-if="!user">
                        <AuthModal :isLogin="false" />
                        <AuthModal :isLogin="true" />
                    </div>
                    <div class="right-content" v-else>
                        <AButton type="primary" @click="goToUsersProfile()"> Profile </AButton>
                        <AButton type="primary" @click="handleLogout()"> Logout </AButton>
                    </div>
                </div>
            </div>
        </Container>
    </ALayoutHeader>
</template>

<style scoped>
.nav-container {
    display: flex;
    justify-content: space-between;
}

.content {
    display: flex;
    align-items: center;
}

.left-content,
.right-content {
    display: flex;
    align-items: center;
}

.left-content a {
    margin-right: 10px;
}

.right-content button {
    margin-left: 10px;
}
</style>