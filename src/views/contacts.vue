<template>
  <div class="container">
    <div class="container">
    <div class="row profile">
		<div class="col-md-3">
     	<div style="border:1px solid  #c4c4c4;" class="profile-sidebar">
				<div class="profile-userpic">
					<img :src="authUser.avatar" alt="">
				</div>
				<div class="profile-usertitle">
					<div class="profile-usertitle-name">
						{{authUser.name}}
					</div>
					<div class="profile-usertitle-job">
						{{authUser.email}}
					</div>
				</div>
				<div class="profile-userbuttons">
					<button type="button" @click="action = 'update_login_user'" class="btn btn-success btn-sm">Update</button>
					<button type="button" @click="action = 'delete_login_user'" class="btn btn-danger btn-sm">Delete</button>
				</div>
        <div class="profile-userbuttons">
					<button type="button" @click="action = 'create_new_user'" class="btn btn-success btn-sm">Create New Contact</button>
				</div>
			</div>
      <hr>
      <div class="created_user_div">
      <div v-for="createduser in created_users">
          <div style="border:1px solid  #c4c4c4;" class="user_list" @click="createdseletedUser = createduser; action = 'show_created_user';">
            <img src="../assets/download.png" style="width: 50px; height: 40px;" alt="">
					  <p style="padding-left: 10px;padding-top: 10px;margin-bottom: 5px;">{{createduser.name}}</p>
          </div>
      </div>
      </div>
		</div>
		<div class="col-md-9">
        <div style="border:1px solid #c4c4c4;" class="profile-content" v-if="action == 'update_login_user'">
          <div class="container">
            <div class="row">
              <div class="col-md-6 postion_class">
                <input type="text" name="name" class="form-control" v-model="name" placeholder="Enter New Name"/>
                <button type="button" @click="updateUser()"  class="button_class btn btn-success btn-sm form-control">Update your name</button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-content" v-else-if="action == 'delete_login_user'">
          <div class="container">
            <div class="row">
              <div class="col-md-6 postion_class">
                <h5>Are you sure you want to delete your account?</h5>
                <button type="button" @click="deleteUser()"  class="button_class btn btn-danger btn-sm form-control">Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div  class="profile-content" v-else-if="action == 'create_new_user'">
          <div class="container">
            <div class="row">
              <div class="col-md-6 create_user">
                <input type="text" name="username" class="form-control" v-model="user.name" placeholder="Enter name"/><br>
                <input type="email" name="useremail" v-model="user.email" class="form-control" placeholder="Enter email"/><br>
                <input type="text" name="useraddress" v-model="user.address" class="form-control" placeholder="Enter address "/><br>
                <button type="button" @click="createNewUser()"  class="button_class btn btn-success btn-sm form-control">Add contact</button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-content" v-else-if="action == 'show_created_user'">
          	<div class="profile-sidebar">
				<div class="profile-userpic">
					<img src="../assets/download.png" style="width: 15%;height: 15%;" alt="">
				</div>
				<div class="profile-usertitle">
					<div class="profile-usertitle-name">
            {{this.createdseletedUser.name}}
					</div>
					<div class="profile-usertitle-job">
						{{this.createdseletedUser.email}}
					</div>
          <div class="profile-usertitle-job">
						{{this.createdseletedUser.address}}
					</div>
				</div>
				<div class="profile-userbuttons">
					<button type="button" @click="action = 'update_created_user'" class="btn btn-success btn-sm">Update</button>
					<button type="button" @click="deleteCreatedUserData()" class="btn btn-danger btn-sm">Delete</button>
				</div>
			</div>
        </div>
        <div class="profile-content" v-else-if="action == 'update_created_user'">
          <div class="container">
            <div class="row">
              <div class="col-md-6 create_user">
                <input type="text" name="username" class="form-control" v-model="createdseletedUser.name" placeholder="Enter name"/><br>
                <input type="email" name="useremail" v-model="createdseletedUser.email" class="form-control" placeholder="Enter email"/><br>
                <input type="text" name="useraddress" v-model="createdseletedUser.address" class="form-control" placeholder="Enter address "/><br>
                <button type="button" @click="updateCreatedUserData()"  class="button_class btn btn-success btn-sm form-control">Update User</button>
              </div>
            </div>
          </div>
        </div>
		</div>
	</div>
</div>
  </div>
</template>

<script>
import * as firebase from "firebase";

export default {
  name: "Contacts",

  data() {
    return {
      authUser: [],
      authUserKey:'',
      users:[],
      name:'',
      action:'update_login_user',
      user:{
      name:'',
      email:'',
      address:'',
      slug:''
      },
      created_users:[],
      createdseletedUser:'',
    };
  },
  methods: {
     updateUser(){
      //  let userRef = firebase.database().ref('users/'+this.authUserKey);?
      if(this.name.length>0){
       firebase.database().ref('users/'+this.authUserKey).update({'name': this.name});
       alert("Name Updated");
       location.reload();
      }
      else{
        alert("Enter Name");
      }
     },
     scrollToBottom() {
      let box = document.querySelector(".created_user_div");
      box.scrollTop = box.scrollHeight;
    },
     deleteUser(){
       var user = firebase.auth().currentUser;
       var _this = this;
        firebase.auth().currentUser.delete().then(function() {
         firebase.database().ref('users/'+_this.authUserKey).remove();
         alert("user deleted");
         _this.$router.push("/");
       }).catch(function(error) {
         alert('Re login to delete account');
         _this.$router.push("/login");
      });
     },
     updateCreatedUserData(){
       var _this = this;
       if(this.createdseletedUser.name && this.createdseletedUser.email && this.createdseletedUser.address){
           if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.createdseletedUser.email)){
            firebase.database().ref('createdUsers/'+_this.authUser.uid+'/'+this.createdseletedUser.slug).update({
                'name': _this.createdseletedUser.name,
                'email': _this.createdseletedUser.email,
                'address': _this.createdseletedUser.address
                });
           alert("user updated");
           }
           else{
             alert("Enter valid Email");
           }
       }else{
       alert("Fill All Fields");
       }
     },
     deleteCreatedUserData(){
       var _this = this;
            firebase.database().ref('createdUsers/'+_this.authUser.uid+'/'+_this.createdseletedUser.slug).remove();
            alert("deleted successfully");
            _this.action = 'update_login_user';
            _this.getCreatedUsers();
     },
     createNewUser(){
       var _this = this;
       if(this.user.name && this.user.email && this.user.address){
           if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.user.email))
          {
          var updates={};
          var removespacename = _this.user.name.replace(/\s/g,'');
          _this.user.slug = removespacename+'-slug';
          updates['createdUsers/'+_this.authUser.uid+'/'+_this.user.slug]=_this.user;
          firebase.database().ref().update(updates).then(()=>{
            _this.user.name = "";
            _this.user.email = "";
            _this.user.address = "";
            alert("User created Successfully");
            _this.getCreatedUsers();
          })
           }else{
             alert("Enter valid Email");
           }
       }else{
       alert("Fill All Fields");
       }
     },
     getCreatedUsers() {
           this.created_users= [];
           var _this = this;
          firebase.database().ref().child('createdUsers/'+_this.authUser.uid).once('value',(snapshot)=>{
          var created_users = snapshot.val();
          for(var createduser in created_users){
             var cuser=created_users[createduser];
             _this.created_users.push(cuser);
           }
          })
         setTimeout(() => {
            // this.scrollToBottom();
          }, 1000);
    },
  },
  created() {
    var _this = this;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.database().ref().child('users/').once('value',(snapshot)=>{
           var users = snapshot.val();
           for(var x in users){
             var dbuser =users[x];
             if(dbuser.email == user.email){
                   this.authUser = dbuser;
                   this.authUserKey = x;
                   this.name = dbuser.name;
                  _this.getCreatedUsers();
             }
           }
          })
      } else {
        this.authUser = [];
      }
    });
    
  },
  //Check if user is authenticated
  beforeRouteEnter(to, from, next) {
    next(vm => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          next();
        } else {
          vm.$router.push("/login");
        }
      });
    });
  }
};
</script>

<style>
/***
User Profile Sidebar by @keenthemes
A component of Metronic Theme - #1 Selling Bootstrap 3 Admin Theme in Themeforest: http://j.mp/metronictheme
Licensed under MIT
***/

body {
  background: #F1F3FA;
}

.postion_class {
    margin-top: 20%;
    margin-left: 25%;
}
.button_class {
  width: 50%; 
  margin-top: 13px;
}
/* Profile container */
.profile {
  margin: 20px 0;
}

.profile-content {
  border:1px solid  #c4c4c4;
}

/* Profile sidebar */
.profile-sidebar {
  padding: 20px 0 10px 0;
  background: #fff;
}

.profile-userpic img {
  float: none;
  margin: 0 auto;
  width: 50%;
  height: 50%;
  -webkit-border-radius: 50% !important;
  -moz-border-radius: 50% !important;
  border-radius: 50% !important;
}

.profile-usertitle {
  text-align: center;
  margin-top: 20px;
}

.profile-usertitle-name {
  color: #5a7391;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 7px;
}

.profile-usertitle-job {
  
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 15px;
}

.profile-userbuttons {
  text-align: center;
  margin-top: 10px;
}
.user_list{
  cursor: pointer;
  display: flex;
  padding: 8px 0 10px 0;
  background: #fff
}
.user_list.img{
  width: 56px;
}

.profile-userbuttons .btn {
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 15px;
  margin-right: 5px;
}

.profile-userbuttons .btn:last-child {
  margin-right: 0px;
}
.create_user{
    margin-left: 24%;
    margin-top: 10%;
}   
.profile-usermenu {
  margin-top: 30px;
}

.profile-usermenu ul li {
  border-bottom: 1px solid #f0f4f7;
}

.profile-usermenu ul li:last-child {
  border-bottom: none;
}

.profile-usermenu ul li a {
  color: #93a3b5;
  font-size: 14px;
  font-weight: 400;
}

.profile-usermenu ul li a i {
  margin-right: 8px;
  font-size: 14px;
}

.profile-usermenu ul li a:hover {
  background-color: #fafcfd;
  color: #5b9bd1;
}

.profile-usermenu ul li.active {
  border-bottom: none;
}

.profile-usermenu ul li.active a {
  color: #5b9bd1;
  background-color: #f6f9fb;
  border-left: 2px solid #5b9bd1;
  margin-left: -2px;
}

/* Profile Content */
.profile-content {
  padding: 20px;
  background: #fff;
  min-height: 535px;
}
.created_user_div {
  height: 200px;
  overflow-y: auto;
}

</style>
