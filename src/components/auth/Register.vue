<template>
    <div class="register">
        <form 
            @submit.prevent="handleSubmit" 
            class="card-panel">
            <h2 class="center pink-text text-lighten-1">Register</h2>
                            <div class="field">

                                <label for="firstName">First Name</label>

                                <input type="text" 
                                    v-model="user.firstName" 
                                    id="firstName" 
                                    name="firstName" 
                                    class="form-control" 
                                    :class="{ 'is-invalid': submitted && $v.user.firstName.$error }" />

                                <div v-if="submitted && !$v.user.firstName.required" 
                                    class="invalid-feedback red-text">
                                        First Name is required
                                </div>
                            </div>

                            <div class="field">
                                
                                <label for="lastName">Last Name</label>

                                <input type="text" 
                                    v-model="user.lastName" 
                                    id="lastName" 
                                    name="lastName" 
                                    class="form-control" 
                                    :class="{ 'is-invalid': submitted && $v.user.lastName.$error }" />

                                <div v-if="submitted && !$v.user.lastName.required" 
                                    class="invalid-feedback red-text">
                                    Last Name is required
                                </div>

                            </div>
                            
                            <div class="field">
                                <label for="email">Email</label>
                                <input type="email" 
                                    v-model="user.email" 
                                    id="email" name="email" 
                                    class="form-control" 
                                    :class="{ 'is-invalid': submitted && $v.user.email.$error }" />

                                <div v-if="submitted && $v.user.email.$error" 
                                    class="invalid-feedback red-text">
                                    <span v-if="!$v.user.email.required" >Email is required</span>
                                    <span v-if="!$v.user.email.email">Email is invalid</span>
                                </div>
                            </div>

                            <div class="field">
                                <label for="password">Password</label>
                                <input type="password" 
                                    v-model="user.password" 
                                    id="password" 
                                    name="password" 
                                    class="form-control" 
                                    :class="{ 'is-invalid': submitted && $v.user.password.$error }" />

                                <div v-if="submitted && $v.user.password.$error" 
                                    class="invalid-feedback red-text">
                                    <span v-if="!$v.user.password.required">Password is required</span>
                                    <span v-if="!$v.user.password.minLength">Password must be at least 6 characters</span>
                                </div>

                            </div>
                            
                            <div class="field">
                                <label for="confirmPassword">Confirm Password</label>
                                <input type="password" 
                                v-model="user.confirmPassword" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                class="form-control" 
                                :class="{ 'is-invalid': submitted && $v.user.confirmPassword.$error }" />
                                
                                <div v-if="submitted && $v.user.confirmPassword.$error" 
                                    class="invalid-feedback red-text">
                                    <span v-if="!$v.user.confirmPassword.required">Confirm Password is required</span>
                                    <span v-else-if="!$v.user.confirmPassword.sameAsPassword">Passwords must match</span>
                                </div>

                            </div>

                            <div v-if="showLog">
                                <ErrorDialog :textMsg="messages"/>
                            </div>   

                            <div class="field center">
                                <button class="btn pink lighten-1">Register</button>
                            </div>
            </form>
    </div>
</template>

<script>
    import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
    import ErrorDialog from '@/components/Dialog/ErrorDialog'
    import slugify from 'slugify'
    import db from '@/firebase/init'
    import firebase from 'firebase'

    
    export default {
        name: "app",
        components: { ErrorDialog },
        data() {
            return {
                user: 
                {
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    fullname: "",
                    slug: null,
                    avatar: ""
                },
                submitted: false,
                messages: null,
                showLog: false
            };
        },
        validations: {
            user: {
                firstName: { required },
                lastName: { required },
                email: { required, email },
                password: { required, minLength: minLength(6) },
                confirmPassword: { required, sameAsPassword: sameAs('password') }
            }
        },
        methods: {
            handleSubmit(e) {
                this.submitted = true;
                this.user.fullname = this.user.firstName + " " + this.user.lastName;
                this.user.slug = slugify(this.user.fullname, 
                {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                let ref = db.collection('users').doc(this.user.slug)
                let fol = db.collection('followers').doc(this.user.slug)
                firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.confirmPassword)
                .then(cred => 
                {
                    ref.set(
                    {
                        fullname: this.user.fullname,
                        user_id: cred.user.uid,
                        avatar: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png' //set the defaul avatar for the new user
                    })
                    fol.set(
                    {
                        user_id: cred.user.uid,
                        followers: null
                    })
                })
                .then(() => 
                {
                    this.$router.push({ name: 'HomeUser'}) //after register, redirect to the user home page
                })
                .catch(err =>
                {
                    this.showLog = true
                    this.messages = err
                })

                // stop here if form is invalid
                this.$v.$touch();
                if (this.$v.$invalid) 
                {
                    return;
                }
            }
        },
        beforeCreate(){
            document.body.className = "body-bg-image";
        }
    };
</script>

<style>
    .register{
        max-width: 500px;
        margin:60px auto;
    }
    .register h2{
        font-size: 2.4em;
    }
    .register .field{
        margin-bottom: 16px;
    }
    label{
        color: #000;
        font-size: 16px;
    }
    .invalid-feedback{
        font-size: 13px;
    }
    

</style>