<script setup>
import { ref, defineProps } from 'vue';
import { supabase } from '../../supabase';
import { useUserStore } from '../../stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// this is the prop that is passed from profile to userbar.vue and then here and we call it on when a new post is added and that post is passed and unshifted to posts array on profile.vue
const props = defineProps(['addNewPost']);

const loading = ref(false);
const open = ref(false);
const errorMessage = ref("");
const caption = ref("");
const file = ref();

const showModal = () => {
    open.value = true;
};

const handleOk = async (e) => {
    loading.value = true;
    const fileName = Math.floor(Math.random() * 100000000);
    let filePath;
    if (file.value) {
        const { data, error } = await supabase.storage.from("images").upload("public/" + fileName, file.value);

        filePath = data.path;
        if (error) {
            loading.value = false;
            return errorMessage.value = "Unable to upload image.";
        }

        await supabase.from("posts").insert({
            url: filePath,
            caption: caption.value,
            owner_id: user.value.id
        })

    }

    loading.value = false;
    open.value = false;
    caption.value = "";

    props.addNewPost({
        url: filePath,
        caption: caption.value
    })
};

const handleFileUploadChange = (e) => {
    if (e.target.files[0]) {
        file.value = e.target.files[0];
    }
}
</script>
<template>
    <div>
        <a-button @click="showModal">Upload Photo</a-button>
        <a-modal v-model:open="open" title="Upload Photo" @ok="handleOk">
            <div v-if="!loading">
                <input type="file" @change="handleFileUploadChange">
                <AInput v-model:value="caption" placeholder="Caption..." />
                <ATypographyText v-if="errorMessage" type="danger">{{ errorMessage }}</ATypographyText>
            </div>

            <div v-else class="spinner">
                <ASpin />
            </div>
        </a-modal>
    </div>
</template>

<style scoped>
input {
    margin-top: 10px;
}

.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

  
  