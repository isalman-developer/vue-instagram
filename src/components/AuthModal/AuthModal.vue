<script setup>
import { defineProps, ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../../stores/user";

const title = props.isLogin ? "Login" : "Signup";
const props = defineProps(["isLogin"]);
const visible = ref(false);

const userStore = useUserStore();
const { errorMessage, loading, user } = storeToRefs(userStore);

const userCredentials = reactive({
  email: "",
  password: "",
  username: "",
});

const clearUserCredentialsInput = () => {
  userCredentials.username = "";
  userCredentials.email = "";
  userCredentials.password = "";
};

const showModal = () => {
  visible.value = true;
};

const handleOk = async (e) => {
  if (props.isLogin) {
    await userStore.handleLogin({
      email: userCredentials.email,
      password: userCredentials.password
    });
  } else {
    await userStore.handleSignup(userCredentials);
  }

  if (user.value) {
    clearUserCredentialsInput();
    visible.value = false;
  }
};

const handleCancel = () => {
  userStore.clearErrorMessage();
  visible.value = false;
};

</script>

<template>
  <div>
    <AButton class="btn" type="primary" @click="showModal">{{ title }}</AButton>
    <AModal v-model:open="visible" title="Basic Modal" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button key="submit" :disabled="loading" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
      </template>
      <div v-if="!loading" class="input-container">
        <AInput class="input" v-if="!props.isLogin" placeholder="Username" v-model:value="userCredentials.username" />
        <AInput class="input" placeholder="Email" v-model:value="userCredentials.email" />
        <AInput class="input" placeholder="Password" type="password" v-model:value="userCredentials.password" />
      </div>
      <div v-else class="spinner">
        <ASpin />
      </div>
      <ATypographyText v-if="errorMessage" type="danger">{{ errorMessage }}</ATypographyText>
    </AModal>
  </div>
</template>

<style scoped>
.btn {
  margin-left: 10px;
}

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}

.input-container {
  height: 120px;
}

.input {
  margin-top: 5px;
}
</style>
