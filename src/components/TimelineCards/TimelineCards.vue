<script setup>
import Card from '../Card/Card.vue';
import { supabase } from '../../supabase';
import { useUserStore } from '../../stores/user';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import Observer from '../Observer/Observer.vue';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const posts = ref([]);
const ownerIds = ref([]);
const lastIndex = ref(2)
const reachedLimit = ref(false);

const fetchFollowersPosts = async () => {

    const { data: followings } = await supabase
        .from("followers_following")
        .select("following_id")
        .eq("follower_id", user.value.id);

    ownerIds.value = followings.map(f => f.following_id);

    const { data } = await supabase
        .from("posts")
        .select()
        .in("owner_id", ownerIds.value)
        .range(0, lastIndex.value)
        .order('created_at', { ascending: false })

    posts.value = data;
}

const fetchNextSetOfFollowers = async () => {
    if (!reachedLimit.value) {
        const { data } = await supabase
            .from("posts")
            .select()
            .in("owner_id", ownerIds.value)
            .range(lastIndex.value + 1, lastIndex.value + 3)
            .order('created_at', { ascending: false })

        posts.value = [
            ...posts.value,
            ...data
        ]

        lastIndex.value = lastIndex.value + 3;
        if (!data.length) {
            reachedLimit.value = true;
        }
    }

}

onMounted(() => {
    fetchFollowersPosts();
});
</script>

<template>
    <div class="timeline-container">
        <Card v-for="post in posts" :key="post.id" :post="post" />
        <!-- we are telling if there is posts length then render the observer. Because when the pics load it takes time and it will render the observer and receive an emit, which will call the fetch next set of followers data. so to avoid it for the first time. we tell it if there is posts data length then render the observe. -->
        <Observer v-if="posts.length" @intersect="fetchNextSetOfFollowers" />
    </div>
</template>