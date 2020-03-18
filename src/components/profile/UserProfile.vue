<template>
    <div class="profile container"
        v-if="profile">
        <div class="wallpaper">
            <img class="user-wallpaper" src="@/assets/bg.jpg">
        </div>

        <div class="profile_img">
            <img class="profile-ava" 
                :src="profile.avatar">
        </div>

        <div class="profile_information"
            v-if="profile">
            <h2 class="profile-name">
                {{profile.fullname}}
            </h2>
            <ul>
                <li>Follower <span>90000</span></li>
                <li>Following <span>100</span></li>
                <li v-if="loggedUser"><router-link 
                    :to="{ name: 'EditUserProfile', params: {id: this.profile.id}}">
                    Edit Information
                </router-link>
                </li>
            </ul>
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
            <div class="album" 
                v-if="posts">
                <AllPosts :posts="posts"/>
            </div>

        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
import AllPosts from '@/components/post/AllPosts'
import NewPost from '@/components/action/NewPost'

export default {
    name: 'UserProfile',
    components: {
        AllPosts,
        NewPost
    },
    data(){
        return{
            profile: null,
            loggedUser: false,
            posts:  [],
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
    },
    beforeCreate(){
        document.body.className = "body-bg-no-image";
        //get the user slug from users collection
        let ref = db.collection('users')
        ref.doc(this.$route.params.id).get().then(user => 
        {
            if(user)
            {
                this.profile =user.data()
                this.profile.id = user.id 
                this.profileUserId = user.data().user_id
                //get all post of this user
                let postdb = db.collection('posts').where('user_id', '==', this.profileUserId)
                postdb.get().then(snapshot => 
                {
                    if(snapshot){
                    snapshot.forEach(doc =>
                        {
                            let post = doc.data()
                            post.id = doc.id
                            this.posts.push({
                                id: post.id,
                                image: post.image,
                                like: post.like,
                                //using moment extension to format dates
                                timestamp: moment(doc.data().timestamp).format('lll'), 
                                title: post.title,
                                user_id: post.user_id,
                                ava: this.profile.avatar,
                                userName: this.profile.fullname,
                                user_slug: this.profile.id,
                            })
                        })
                    }
                })
                //check if this user-profile page a current user to trigger dit user information link
                firebase.auth().onAuthStateChanged((currentUser) => {
                    if (currentUser) 
                    {
                        let userdb = db.collection('users').where('user_id', '==', currentUser.uid)
                        userdb.get().then(userDetect => {
                            if(userDetect) 
                            {
                                userDetect.forEach(userDoc => {
                                        if (userDoc.id == this.profile.id) 
                                        {
                                            this.loggedUser = true
                                        }
                                })
                            }
                        })
                    } 
                    else 
                    {
                        this.user = null
                    }
                })
            }
        })

    },
    created(){
    }
}
</script>


<style scoped>
    .profile{
        box-shadow:0px 0px 20px grey;
        position: relative;
        width: 50%;
        
    }
    .user-wallpaper{
        display: block;
        width: 100%;
        height: 300px;
    }
    .profile-ava{
        border: 5px solid rgb(218, 218, 218);
        border-radius: 50%;
        display: block;
        width: 13em;
        height: 13em;
        position: absolute;
        margin: -115px 0 auto 1em;  
    }
    .profile_information{
        background-color: white;
        height: auto;
        margin-bottom: 40px;
    }
    .profile-name{
        color: rgb(39, 21, 21);
        font-size: 2.5em;
        font-weight: 600;
        margin:0 0 0 6.5em;
        text-shadow:-2px   -2px #F3F3F3,
                                 -2px -1.5px #F3F3F3,
                                 -2px   -1px #F3F3F3,
                                 -2px -0.5px #F3F3F3,
                                 -2px    0px #F3F3F3,
                                 -2px  0.5px #F3F3F3,
                                 -2px    1px #F3F3F3,
                                 -2px  1.5px #F3F3F3,
                                 -2px    2px #F3F3F3,
                               -1.5px    2px #F3F3F3,
                                 -1px    2px #F3F3F3,
                               -0.5px    2px #F3F3F3,
                                  0px    2px #F3F3F3,
                                0.5px    2px #F3F3F3,
                                  1px    2px #F3F3F3,
                                1.5px    2px #F3F3F3,
                                  2px    2px #F3F3F3,
                                  2px  1.5px #F3F3F3,
                                  2px    1px #F3F3F3,
                                  2px  0.5px #F3F3F3,
                                  2px    0px #F3F3F3,
                                  2px -0.5px #F3F3F3,
                                  2px   -1px #F3F3F3,
                                  2px -1.5px #F3F3F3,
                                  2px   -2px #F3F3F3,
                                1.5px   -2px #F3F3F3,
                                  1px   -2px #F3F3F3,
                                0.5px   -2px #F3F3F3,
                                  0px   -2px #F3F3F3,
                               -0.5px   -2px #F3F3F3,
                                 -1px   -2px #F3F3F3,
                               -1.5px   -2px #F3F3F3;
    }
   .profile ul{
        margin-top: 2px;
        margin-left: 17em;

    }
    .profile ul li {
        display: inline-block;
        margin-right: 5em;
        margin-top:0.5em;
    }
    .new-post .el-button{
        background-color: #ee6e73;
        width: 100%;
        font-size: 20px;
        padding: 5px;
        font-size: 20px;
        color: white;
        border: none;
        cursor: pointer;
    }
    .new-post:after { 
    content: " "; 
    display: block;
    clear: both;
} 
    .album{
        border-top: 3px solid black;
        margin: 1em;
    }

</style>
