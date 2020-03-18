<template>
  <div>
    <h2>Please login to continue</h2>
    <button @click="login">Login with Google</button>
  </div>
</template>

<script>
import * as firebase from "firebase";
export default {
  methods: {
    login() {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          var updates={};
          var loginUser={
          uid: user.uid,
          name:user.displayName,
          avatar:user.photoURL,
          email:user.email,
          createdAt: new Date()
          }
          // firebase.database.ref().child('users/').once('value',(snapshot)=>{
          //   var users=snapshot.val();
          // })
          firebase.database().ref().child('users/').once('value',(snapshot)=>{
           var users = snapshot.val();
           var count = 0;
           var _this = this;
           for(var x in users){
             var cc =users[x];
             if(cc.email == result.user.email){
               count++;
             }
           }
           if(count==0){
          updates['users/'+firebase.database().ref().push().key]=loginUser;
          firebase.database().ref().update(updates).then(()=>{
           _this.$router.push("/");
          })
           }else{
           _this.$router.push("/");
           }
          })
          
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    }
  }
};
</script>