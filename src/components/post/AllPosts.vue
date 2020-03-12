<template>
    <div class="post"
        v-if="posts">
        <div class="card user-post" 
            v-for="post in posts" 
            :key="post.id">
            <div class="card-image">
                <img class="activator" :src="post.image">
            </div>

            <div class="card-content post-info">
                <a class="btn grey lighten-2 btn-follow" 
                    :class="{'pink-text' : post.has_been_followed}" 
                    @click="follow(post.id)" v-if="!post.has_been_followed">
                    follow
                </a>
                <!-- transfer the text to 'followed' if the current user already follow this person -->
                <a class="btn grey lighten-2 btn-follow" 
                    :class="{'pink-text' : post.has_been_followed}" 
                    @click="follow(post.id)" v-else>
                    followed
                </a>
                <!-- direct to this person's profile after clicked to this avatar -->
                <span class="card-title activator grey-text text-darken-4 user-name">
                    <router-link 
                    :to="{ name: 'UserProfile', params: {id: post.user_slug}}">
                        <img class="newsfeed-av" 
                            :src="post.ava">
                    </router-link>
                    {{ post.userName }}
                </span>
                <span class="card-title activator grey-text text-darken-4 post-title">
                    {{ post.title }}
                </span>
                <p class="grey-text text-darken-4">
                    {{post.timestamp}} 
                    <span class="like-count">
                        &#128151;
                    </span>
                    {{ post.like }}
                </p>
                <a class="btn grey lighten-2 btn-like" 
                    :class="{'pink-text' : post.has_been_liked}" 
                    @click="likePost(post.id)">
                    <i class="material-icons">
                        favorite
                    </i>
                </a>
            </div>
            </div>
        </div>
</template>

<script>
export default {
    name: 'AllPosts',
    props: ['posts'],
    data(){
        return {

        }
    }
}
</script>

<style>
    .newsfeed-av{
        border: 5px solid rgb(218, 218, 218);
        border-radius: 50%;
        display: block;
        float: left;
        margin: 0.4em;
        height: 4em;
        width: 4em;
    }
    .post-info{
        height: auto;
    } 
    .user-name{
        margin-top: 0.5em;
        font-weight: bold !important;
        font-size: 2em !important;
    }
    .post-title{
        font-size: 1.5em !important;
    }
    .btn-like{
        margin-top:0.25em;
        margin-bottom: 0.5em;
        border: none;
    }
    .like-count{
        margin-left: 20px;
    }
    .btn-follow{
        float: right;
        font-weight: bold;
        margin-top:0.3em;
        margin-right: 1.3em;
    }   
</style>