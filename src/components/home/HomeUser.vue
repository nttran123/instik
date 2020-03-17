<template>
    <div class="home-user container">
        <div class="new-post">
            <el-button
                @click="showNewPost"
                v-if="!showFormNewPost"
            >
                New Post
            </el-button>

            <div v-if="showFormNewPost">
                <NewPost @handleEvent="handleEvent" />
            </div>
        </div>
        <div class="container-list">
            <Loading v-if="!posts"/>
            <AllPosts :posts="posts" />
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import moment from 'moment'
import AllPosts from '@/components/post/AllPosts'
import Loading from '@/components/Dialog/Loading'
import NewPost from '@/components/action/NewPost'

export default {
    name: 'HomeUser',
    components: {
        AllPosts,
        Loading,
        NewPost
    },
    data(){
        return {
            posts:[],
            current_user_id: null,
            current_user_slug: null,
            followers:[],
            follower_posts: [],
            unfollower_posts: [],
            showFormNewPost: false
        }
    },
    methods: {
        showNewPost() {
            // Ẩn hiện form new post
            this.showFormNewPost = true
        },
        handleEvent(event, data) {
            // Lắng nghe sự kiện từ component con
            if (event === 'closeFormNewPost') {
                this.showFormNewPost = false
            }
        },
        follow(id){
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
    },
    beforeCreate(){
        document.body.className = "body-bg-no-image";
                //get all data from posts collection
        let postdb = db.collection('posts').orderBy('timestamp', "desc")
        postdb.onSnapshot(snapshot => 
        {
            if(snapshot.docChanges()){
                snapshot.docChanges().forEach(change =>
                {
                    if(change)
                    {
                        if(change.type == 'added')
                        {
                            let post = change.doc
                            //get user data
                            let ref = db.collection('users').where('user_id', '==', post.data().user_id)
                                ref.get().then(all_user_inf => 
                                {
                                    if(all_user_inf)
                                    {
                                        all_user_inf.forEach(doc =>
                                        {
                                            //push the data from database to posts array
                                            this.posts.push({
                                                id: post.id,
                                                image: post.data().image,
                                                like: post.data().like,
                                                //using moment extension to format dates
                                                timestamp: moment(post.data().timestamp).format('lll'), 
                                                title: post.data().title,
                                                user_id: post.data().user_id,
                                                ava: doc.data().avatar,
                                                userName: doc.data().fullname,
                                                user_slug: doc.id,
                                                has_been_liked: false,
                                                has_been_followed: false
                                            }) //push the data to the posts array
                                        })
                                    }
                                })
                        }
                    }
                })
            }
        })
        

    },
    created(){
        //get current user information
        firebase.auth().onAuthStateChanged((user) =>
        {
            //check if user logged in
            if(user)
            {
                //get current user uid 
                this.current_user_id = user.uid;   
                //get the current user information from 'firebase' using user.uid
                let ref = db.collection('users').where('user_id', '==', this.current_user_id)
                ref.get().then(user_inf => 
                {
                    if(user_inf)
                    {
                        user_inf.forEach(u_inf =>
                        {
                            //get the slug of the user
                            this.current_user_slug = u_inf.id
                            //The idea is we compare each 'post.user_id' with the follower array that we got from 'firebase'
                            //if 'post.user_id' included, push the post to another array named 'follower_posts'
                            //else push the post to other array named 'unfollower_posts'
                            // set 'this.posts' = this.follower_posts.concat(this.unfollower_post) to make the followers_posts have the first position in the array => showing first
                            let fl = db.collection('followers').where('user_id', '==', this.current_user_id)
                            fl.get().then((fl_inf) => 
                            {
                                if(fl_inf)
                                {
                                    fl_inf.forEach(f_inf=>
                                    {
                                        let flws = f_inf.data().followers
                                        if(flws){
                                            flws.forEach(flw => 
                                            {
                                                this.followers.push(flw)
                                            })
                                        }


                                    })
                                    if(this.followers)
                                    {
                                        this.posts.filter(post => 
                                        {
                                            if(this.followers.includes(post.user_id))
                                            {
                                                this.follower_posts.push(post)
                                            }
                                            else
                                            {
                                                this.unfollower_posts.push(post)
                                            }

                                        })
                                        this.posts = this.follower_posts.concat(this.unfollower_posts)  
                                        //light the follow button if the current user already follow this person
                                        for (let i in this.posts){
                                            if(this.followers.includes(this.posts[i].user_id)){
                                                this.posts[i].has_been_followed = true
                                            }
                                        }
                                    } 
                                } 
                                else{
                                    console.log('no fl_inf')
                                }             
                            })

                        })
                    }
                    else{
                        console.log('no current user')
                    }

                })

            }
            //if no user
            else
            {
                this.current_user_id = null
            }
        })
    } 
      
}
</script>

<style scoped>
    .home-user .new-post, .home-user .container-list {
        width: 100%;
        float: left;
    }

    .home-user .new-post .el-button {
        background-color: #ee6e73;
        width: 100%;
        font-size: 20px;
        padding: 5px;
    }
</style>

<style>
    .home-user{
        height: auto;
        margin-top: 1em;
        max-width: 50%;
        position: relative;
    }
    .new-post-btn{
        display: block;
        margin: auto;
        width: 100%;
    }
</style>