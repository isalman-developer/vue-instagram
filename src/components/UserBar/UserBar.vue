<script setup>
import { defineProps } from "vue"
import PhotoModal from "../PhotoModal/PhotoModal.vue";
import { useRoute } from "vue-router"
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
import { supabase } from "../../supabase";

const userStore = useUserStore()
const props = defineProps(['user', 'userInfo', 'addNewPost', 'isFollowing','updateIsFollowing'])
const route = useRoute()
const { user } = storeToRefs(userStore);
const { username: profileUsername } = route.params;

const followUser = async () => {
    // updateIsFollowing is defined in profile, & is used to change updateIsFollowing value & let the dom re-render to switch button text b/w follow & unfollow
    props.updateIsFollowing(true);
    const { response } = await supabase.from("followers_following").insert({
        follower_id: user.value.id,
        following_id: props.user.id //user who's profile is opened. it would be the following account
    });
}

const unFollowUser = async () => {
    // updateIsFollowing is defined in profile, & is used to change updateIsFollowing value & let the dom re-render to switch button text b/w follow & unfollow
    props.updateIsFollowing(false);
    const { response } = await supabase.from("followers_following")
        .delete()
        .eq("follower_id", user.value.id)
        .eq("following_id", props.user.id);
}


</script>

<template>
    <div class="userbar-container" v-if="props.user">
        {{ props.profileUser }}
        <div class="text-container">
            <div class="top-content">
                <a-typography-title :level="2">{{ props.user.username }}</a-typography-title>
                <div v-if="user">
                    <PhotoModal v-if="user.username === profileUsername" :addNewPost="addNewPost" />
                    <div v-else>
                        <AButton v-if="!props.isFollowing" @click="followUser">Follow</AButton>
                        <AButton v-else @click="unFollowUser()">Following</AButton>
                    </div>
                </div>
            </div>
            <div class="bottom-content">
                <a-typography-title :level="5">{{ props.userInfo.posts }} Posts</a-typography-title>
                <a-typography-title :level="5">{{ props.userInfo.followers }} Followers </a-typography-title>
                <a-typography-title :level="5">{{ props.userInfo.following }} Followings </a-typography-title>
            </div>
        </div>
    </div>

    <div class="userbar-container" v-else>
        <div class="text-container">
            <div class="top-content">
                <a-typography-title :level="2">User Not Found..</a-typography-title>
            </div>
        </div>
    </div>
</template>

<style scoped>
.userbar-container {
    padding-bottom: 75px
}

.bottom-content {
    display: flex;
    align-items: center;
}

.bottom-content h5 {
    margin: 0px !important;
    padding: 0px;
    margin-right: 30px !important;
    align-items: center;
}

.top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>