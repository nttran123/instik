import firebase from 'firebase'
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAFoxs6LbZqdMpObBXLao4HcClEzgOSD0s",
    authDomain: "instik-image.firebaseapp.com",
    databaseURL: "https://instik-image.firebaseio.com",
    projectId: "instik-image",
    storageBucket: "instik-image.appspot.com",
    messagingSenderId: "609740132018",
    appId: "1:609740132018:web:cd6f4a233f9e908a7b03ab",
    measurementId: "G-7E9RWKWY8F"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

//export firestore database
export default firebaseApp.firestore()