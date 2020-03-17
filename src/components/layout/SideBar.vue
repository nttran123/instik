<template>
    <div class="sidebar">
        <ul id="mobile-demo" class="sidenav">
            <li>
                <div class="user-view">
                    <div id="bg-sidenav" class="background bg-side-menu"></div>
                    <div v-if="user_info" class="profile-pic">
                        <img class="circle ava-profile" :src="user_info.avatar">
                        <div class="edit">
                            <router-link 
                            :to="{name: 'EditUserProfile', params: {id: this.user_info.id }}">
                                <i class="material-icons">
                                  edit</i>
                            </router-link>
                        </div>
                    </div>
                    <router-link 
                    v-if="user_info" 
                    :to="{ name: 'UserProfile', params: {id: this.user_info.id}}">
                      <span class="white-text name">
                        {{ user_info.fullname }}
                      </span>
                    </router-link>
                    <a v-if="user_info" href="#email"><span class="white-text email">{{ user_info.email }}</span></a>
                </div>
            </li>
            <li>
                <router-link 
                v-if="user_info"
                :to="{ name: 'UserProfile', params: {id: this.user_info.id}}">
                    <i class="material-icons">account_circle</i>View Profile
                </router-link>
            </li>
            <li>
                <router-link 
                v-if="user_info"
                :to="{ name: 'HomeUser'}">
                    <i class="material-icons">web</i>Index
                </router-link>
            </li>
            <li>
                <div class="divider"></div>
            </li>
            <li v-if="!user">
                <router-link 
                :to="{ name: 'Register'}">
                    <i class="material-icons">create</i>Register
                </router-link>
            </li>
            <li v-if="!user">
                <router-link 
                :to="{ name: 'Login'}">
                    <i class="material-icons">check_box</i>Login
                </router-link>
            </li>
            <li v-if="user">
                <a id="btn-logout" @click="logOut">
                    Log out
                </a>
            </li>
        </ul>
        <a href="#" 
        data-target="slide-out" 
        class="sidenav-trigger">
          <i class="material-icons">
            menu
          </i>
        </a>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
    
    name: "SideBar",
    props: {
        sideBar: null
    },
    data(){
        return {
            user: null,
            user_info: null
        }
    },
    //log user out and redirect to login page
    methods: {
        logOut() {
            firebase.auth().signOut().then(() => {
                this.$router.push({
                        name: 'Login'
                    }),
                    this.user = null,
                    this.user_info = null
            })
        }
    },

    //get data of a current user from database before render
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
                let ref = db.collection('users').where('user_id', '==', this.user.uid)
                ref.get().then(snapshot => {
                    if (snapshot) {
                        snapshot.forEach(doc => {
                            if (doc) {
                                this.user_info = doc.data()
                                this.user_info.id = doc.id
                            }

                        })
                    }
                })
            } else {
                this.user = null
            }
        })

    },
    //Stack Menu
    mounted() {
        $(document).ready(function() {
            $('.sidenav').sidenav({
                edge: 'left'
            });
        });

    },
    beforeCreate() {
        document.getElementsByClassName("bg-side-menu").className = "bg-side-menu";
    }
}

</script>

<style lang="scss" scoped>

</style>