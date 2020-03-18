<template>
    <div class="new-post-container">
        <el-form
            ref="newPostForm"
            :model="newPostForm"
            :rules="newPostRule"
            class="new-post-form"
            autocomplete="on"
            label-position="left"
        >
            <el-form-item prop="title">
                <label>Title</label>
                <el-input
                    ref="title"
                    v-model="newPostForm.title"
                    type="textarea"
                    :rows="2"
                    placeholder="Please enter content..."
                    class="new-post-form-title"
                    autocomplete="on"
                    label-position="left"
                />
            </el-form-item>
            <el-form-item prop="file">
                <input
                    ref="fileInput"
                    type="file"
                    name="file"
                    class="new-post-form-input-file"
                    placeholder="Select picture"
                    :class="{hidden: selectedPicture}"
                    @change="handlePreview"
                />
                <img
                    v-if="showImage"
                    class="preview-image"
                    :src="srcImage"
                    @click="handleChangeImage"
                />
            </el-form-item>

            <div v-if="showLog">
                <ErrorDialog :textMsg="messages"/>
            </div>

            <div class="form-footer">
                <el-button
                    class="btn-cancel"
                    :loading="loading"
                    @click="closeFormNewPost"
                >
                    Cancel
                </el-button>

                <el-button
                    class="btn-submit"
                    :loading="loading"
                    @click="handleUpload"
                >
                    Save
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import ErrorDialog from '@/components/Dialog/ErrorDialog'
import Loading from '@/components/Dialog/Loading'

export default {
    name: 'NewPost',
    components: {
        ErrorDialog,
        Loading
     },
    data(){
        return{
            srcImage: '',
            showImage: false,
            selectedPicture: false,
            showLog: false,
            messages: '',
            loading: false,
            newPostForm: {
                title: '',
                user_id: null,
                file: null
            },
            newPostRule: {
                title: [{ required: true, trigger: 'blur' }]
            }
        }
    },
    methods: {
        handleChangeImage() {
            this.$refs.fileInput.click()
        },
        handlePreview(event) {
            var file = event.target.files[0]

            if (file) {
                this.newPostForm.file = file
                this.srcImage = URL.createObjectURL(file)
                this.showImage = true
                this.selectedPicture = true
            }
        },
        handleUpload() {
            console.log('handleUpload')
            this.$refs.newPostForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.showLog = false

                    if (this.newPostForm.file) {
                        // Upload image
                        var storageRef = firebase.storage().ref('user_post/'+this.newPostForm.file.name)
                        var uploadTask =  storageRef.put(this.newPostForm.file)

                        uploadTask.on('state_changed', (snapshot) => {
                            this.showLog = true
                            this.messages = 'Please wait until the image upload successfully! (3~5s)'
                            this.uploadSuccess = false
                        }, (error) => {
                            this.showLog = true
                            this.messages = error
                        }, () => 
                        {
                            //get the image link and set it to newAva
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                this.showLog = true
                                this.messages = 'Update image successfully'

                                // Save post
                                this.savePost(this.newPostForm.user_id, this.newPostForm.title, downloadURL)
                            })
                        })
                    } else {
                        // Save post
                        this.savePost(this.newPostForm.user_id, this.newPostForm.title, null)
                    }
                }
            })
        },
        savePost(user_id, title, image) {
            db.collection('posts').add({
                title: title,
                image: image,
                timestamp: Date.now(),
                user_id: user_id,
                like: 0,
            })
            .then(() =>  {
                this.closeFormNewPost('')
            })
            .catch(err =>  {
                this.showLog = true
                this.messages = err
            })
        },
        closeFormNewPost(data) {
            // Reset value
            this.selectedPicture = false
            this.showImage = false
            this.srcImage = ''

            if (!data) {
                data = ''
            }
            // Emit về component cha.
            // Parameter 1: method đc khai báo tại component cha trong phần giao diện lúc add component con vào
            // Parameter 2: event
            // Parameter 3: data
            this.$emit('handleEvent', 'closeFormNewPost', '')
        },
    },
    beforeCreate(){
        document.body.className = "body-bg-no-image";
    },
    created(){
        firebase.auth().onAuthStateChanged((user) =>
        {
            if(user)
            {
                this.newPostForm.user_id = user.uid;
            }
            else
            {
                this.newPostForm.user_id = null
            }
        })
    }
}
</script>

<style scoped>
.new-post-container .el-form .el-form-item .new-post-form-input-file.hidden {
        display: block;
    }
    .new-post-container {
        width: 100%;
        float: left;
        background: #EE6E73;
        border-radius: 5px;
    }

    .new-post-container .el-form {
        padding: 5px;
        border-radius: 8px;
    }

    .new-post-container .el-form .el-form-item {
        width: 100%;
        float: left;
    }

    .new-post-container .el-form .el-form-item label {
        font-size: 18px;
        color: #000000;
    }

    .new-post-container .el-form .el-form-item .new-post-form-title {
        background: #ffffff;
        border-radius: 5px;
        padding: 5px;
        margin-bottom: 10px;
    }

    .new-post-container .el-form .el-form-item .preview-image {
        width: 150px;
        height: 150px;
        float: left;
        padding: 5px;
        border-radius: 10px;
        cursor: pointer;
    }

    .new-post-container .el-form .form-footer {
        width: 100%;
        float: left;
        text-align: center;
        padding: 10px;
    }

    .new-post-container .el-form .form-footer .el-button {
        font-size: 18px;
        width: 100px;
        line-height: 30px;
        border-radius: 8px;
        cursor: pointer;
    }

    .new-post-container .el-form .el-button.btn-submit {
        background: #61bdea;
    }

    .new-post-container .el-form .el-button.btn-cancel {
        background: #dddddd;
    }
</style>

<style lang="scss">
    .new-post-container .el-form .el-form-item {
        .new-post-form-title textarea {
            border: none!important;
        }
    }

    .el-form-item__error {
        color: #ff0000
    }
</style>