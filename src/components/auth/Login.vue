<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
        >
            <el-image :src="url" />

            <el-form-item prop="username">
                <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="Email"
                name="username"
                type="text"
                tabindex="1"
                autocomplete="on"
                />
            </el-form-item>

            <el-tooltip
                v-model="capsTooltip"
                content="Caps lock is On"
                placement="right"
                manual
            >
                <el-form-item prop="password">
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="Password"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                    @keyup.enter.native="handleLogin"
                />
                </el-form-item>
            </el-tooltip>

            <div v-if="showLog">
                <ErrorDialog :textMsg="messages"/>
            </div>


            <el-button
                class="btn-submit"
                :loading="loading"
                @click.native.prevent="handleLogin"
            >
                Login
            </el-button>
        </el-form>
    </div>
</template>

<script>
import ErrorDialog from '@/components/Dialog/ErrorDialog'
import { validEmail } from '@/utils/validate'
import firebase from 'firebase'

export default {
    name: 'login',
    components: { ErrorDialog },
    data(){
        const validateUsername = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('Please enter the correct username or email'))
            } else if (!validEmail(value)) {
                callback(new Error('Email is incorrect'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('The password can not be less than 6 digits'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            showFormResetPassword: false,
            passwordType: 'password',
            capsTooltip: false,
            loading: false,
            messages: null,
            showLog: false,
            url: require('@/assets/logo.png')
        }
    },
    mounted() {
        //focus
        if (this.loginForm.username === '') {
            this.$refs.username.focus()
        } else if (this.loginForm.password === '') {
            this.$refs.password.focus()
        }
    },
    methods:{
        checkCapslock(e) {
            const { key } = e
            this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.showLog = false

                    firebase.auth().signInWithEmailAndPassword(this.loginForm.username, this.loginForm.password).then(cred =>
                    {
                        this.loading = false
                        this.$router.push({ name: 'HomeUser'}) //after login, direct to home user page
                    }).catch(err => {
                        this.loading = false
                        this.showLog = true
                        this.messages = err
                    })
                }
            })
        },
    },
    beforeCreate() {
        document.body.className = "body-bg-image";
    }

}
</script>

<style lang="scss" scoped>
.login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 0 35px 0;
        margin: 0 auto;
        overflow: hidden;
        background: #ffffff;
        margin-top: 50px;

        .btn-submit {
            width: 100%;
            border: none;
            border-radius: 7px;
            padding: 12px;
            margin-bottom: 50px;
            background: #ec407a;
            color: #ffffff;
            margin-top: 20px;
        }
    }
}
</style>

<style lang="scss">
/* reset element-ui css */
.login-container {
    .el-image {
        width: 100%;
        text-align: center;
        margin-top: 50px;

        img {
            width: 100%;
            height: 230px;
        }
    }

    .el-input {
        display: inline-block;
        height: 47px;
        width: 100%;
        float: left;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 0;
            margin-bottom: 0;
            color: #000;
            height: 47px;
        }
    }

    .el-form-item {
        margin-top: 20px;

        .el-input {
            border-bottom: 1px solid #BDBDBD;
            color: #454545;
        }
    }

    .el-form-item__content {
        .el-form-item__error {
            color: #ff0000;
        }
    }
}
</style>