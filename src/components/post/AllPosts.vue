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
import db from '@/firebase/init'
import firebase from 'firebase'
export default {
    name: 'AllPosts',
    props: 
    [
        'posts',
        'current_user_id',
        'current_user_slug',
        'followers',
        'follower_posts',
        'unfollower_posts'
    ],
    data(){
        return {

        }
    },
    methods:{
        follow(id)
        {
            //find user_id of this post by post.id
            for (let i in this.posts) 
            {
                if (this.posts[i].id == id) 
                {
                    //check if 'followers' array empty or does not exist
                    if(this.followers.length == 0)
                    {
                        //push user_id of this post to another array named 'followers'
                        this.followers.push(this.posts[i].user_id)
                        //change the value of 'has_been_followed' in 'posts' array to true
                        this.posts[i].has_been_followed = true
                        console.log(this.followers)
                        //update new information for the firebase document named 'followers'
                        db.collection('followers').doc(this.current_user_slug).update({
                            user_id: this.current_user_id,
                            //get data from 'followers' array and transfer to 'followers' field in firebase
                            followers: this.followers 
                        })
                    }
                    //if already has follower(s)
                    else
                    {
                        //check if 'followers' array already has this post's user_id
                        if(this.followers.includes(this.posts[i].user_id))
                        {
                            alert("You have already follow this person")
                        }
                        //if not, do the same things as above to get follower_id and update to 'followers' field in firebase
                        else{
                            this.followers.push(this.posts[i].user_id)
                            this.posts[i].has_been_followed = true
                            console.log(this.followers)
                            db.collection('followers').doc(this.current_user_slug).update({
                                user_id: this.current_user_id,
                                followers: this.followers
                            })
                        }
                    }    
                }
            }

        },

        likePost(id){
            //run for loop to find current post data by post.id
            for (var i in this.posts) 
            {
                if (this.posts[i].id == id) 
                {
                    if(this.posts[i].has_been_liked == false)
                    {
                        this.posts[i].like++; //increse like by 1
                        this.posts[i].has_been_liked = true; 
                        //send to database
                        db.collection('posts').doc(id).update({
                        like: this.posts[i].like
                        })                   
                        break; //Stop this loop
                    }
                    else
                    {
                        this.posts[i].like--; //decrease like by 1
                        this.posts[i].has_been_liked = false;
                        //send to database
                        db.collection('posts').doc(id).update({
                        like: this.posts[i].like
                        })
                    break; //Stop this loop
                    }
                    
                }
            }
        }
    }
}
</script>

<style>
    .post{
        margin-top: 1em;
    }
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