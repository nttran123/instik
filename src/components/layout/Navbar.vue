<template>
    <div class="nav-bar navbar-fixed">
        <nav>
            <div class="nav-wrapper">
                <router-link :to="{ name: 'HomeUser'}" class="brand-logo logo">
                    Instik
                </router-link>
                <!-- Display Mobile Menu -->
                <a  href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                <!-- Display Stack menu button when logged in -->
                <ul data-target="mobile-demo" class="right hide-on-med-and-down sidenav-trigger">
                     <li v-if="user"><a  href="#"><i class="material-icons">menu</i></a></li>
                </ul>
                <!-- Menu when not login -->
                <ul class="right hide-on-med-and-down">    
                   <li 
                   v-if="!user">
                   <router-link
                   :to="{ name: 'Register'}">
                     Register
                   </router-link>
                   </li>
                   <li v-if="!user">
                   <router-link 
                   :to="{ name: 'Login'}">
                     Login
                   </router-link>
                   </li>
                </ul>
            </div>
        </nav>
        <!-- Add component SideBar -->
        <SideBar></SideBar>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import SideBar from '@/components/layout/SideBar'

export default {
    name: 'Navbar',
    components: {
        SideBar
    },
    data() {
        return {
            user: null,
            user_info: null
        }
    },
    methods: {

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

    }
}
</script>

<style lang="scss">
$cursor: pointer;
$breakpoint: 993px;

@media screen and (min-width: #{$breakpoint}) {
    .logo {
        margin-left: 5em;
        
    }
}
.nav-bar  {
    .nav-wrapper {
        height: 54px;
    }
}
.sidenav-overlay {
    z-index: 996;
}

.ava-profile {
    border: 3px solid rgb(218, 218, 218);
    border-radius: 50%;
    width: 1em;
    height: 1em;
}

.sidenav {
    .user-view {
        .circle {
            height: 70px;
             width: 70px;
        }
    }    
}

.profile-pic {
    position: relative;
    display: inline-block;
}

.profile-pic {
    &:hover{
        .edit {
            display: block;
            opacity: 1;
        }
    }
    
}

.edit {
    padding-left: 35%;
    padding-top: 30%;
    position: absolute;
    right: 0;
    bottom: 0;
    display: none;
    height: 100%;
    width: 100%;
    opacity: 0;
    background: rgba(0, 0, 0, 0.5);
    transition: .5s ease;
    border-radius: 50%;
}

.edit {
    a {
     color: rgb(230, 230, 230);
    } 
}

.sidenav {
    .user-view {
        .name {
            margin-top: 0;
        }
    }
}

#btn-logout{
    cursor: $cursor;
}
</style>
