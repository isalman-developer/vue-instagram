<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import Container from "../UI/Container.vue";
import UserBar from "../UserBar/UserBar.vue";
import Imagegallery from "../imagegallery/imagegallery.vue";
import { supabase } from "../../supabase";
import { useRoute } from "vue-router";
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";

const route = useRoute();
const userStore = useUserStore();

const { user: loggedInUser } = storeToRefs(userStore)
const { username } = route.params;
const userInfo = reactive({
    posts: 0,
    followers: 0,
    following: 0
})
const posts = ref([]);
const user = ref(null);
const isFollowing = ref(false);
const loading = ref(false);
/*
    Function to unshift the posts array, to insert the new post to the start of the posts.
    We will pass this function as a porps to userbar, and then we from there we will pass it to the photoModal componone, 
    Where when a new post is added then we will call this function and pass that new post, which here will be unshifted
*/
const addNewPost = (post) => {
    posts.value.unshift(post);
}

const fetchData = async () => {
    loading.value = true;
    const { data: userData } = await supabase.from("users").select().eq("username", username).single();

    if (!userData) {
        loading.value = false;
        return user.value = null;
    }

    user.value = userData;
    const { data: postsData } = await supabase.from("posts").select().eq("owner_id", user.value.id)
    posts.value = postsData;

    // we are making it await, because the request has to be made and then wait for its reponse
    await fetchIsFollowing();
    await countFF();
    loading.value = false;
}

// we are using this function as a state or as a props, to update the component. when is followed button will change to unfollow,
// when click on unfollow then button will change to follow. it will help in reactivity
const updateIsFollowing = (follow) => {
    isFollowing.value = follow;
}

// to calculate follower, following and posts
const countFF = async () => {
    const { count: followersCount } = await supabase
        .from("followers_following")
        .select("*", { count: 'exact' })
        .eq("following_id", user.value.id);

    const { count: followingsCount } = await supabase
        .from("followers_following")
        .select("*", { count: 'exact' })
        .eq("follower_id", user.value.id);

    userInfo.posts = posts.value.length;
    userInfo.followers = followersCount;
    userInfo.following = followingsCount;

}

const fetchIsFollowing = async () => {
    if (loggedInUser.value && user.value && (loggedInUser.value.id !== user.id)) {

        const { data, error } = await supabase
            .from('followers_following')
            .select()
            .eq("follower_id", loggedInUser.value.id)
            .eq("following_id", user.value.id)
            .limit(1)
            .single()

        if (data) isFollowing.value = true;

    }
}

// it means to wait for loggedInUser, when it gets the value then call the function
watch(loggedInUser, () => {
    fetchIsFollowing()
})

onMounted(() => {
    fetchData()
});

</script>

<template>
    <Container>
        <div class="profile-container" v-if="!loading">
            <UserBar :key="$route.params.username" :user="user" :userInfo="userInfo" :addNewPost="addNewPost"
                :isFollowing="isFollowing" :updateIsFollowing="updateIsFollowing" />
            <Imagegallery :posts="posts" />
        </div>

        <div class="spinner" v-else>
            <ASpin />
        </div>
    </Container>
</template>

<style scoped>
.profile-container {
    width: 100%;
}

.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.image {
    margin: 5px;
    width: 200px;
}
</style>