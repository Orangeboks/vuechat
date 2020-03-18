<template>
  <div class="container">
   
    <br>
    <div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div>
              <h4 class="headerName">Hi {{authUser.name}}!</h4>
            </div>


            <a href="javascript:void(0)" @click="group_chat=true;">Join free for all chat</a>
          </div>
          <div class="inbox_chat">
            <div class="chat_list" v-if="user.email != authUser.email" v-for="user in users">
              <div class="chat_people" @click="receiver_uid = user.uid; privateChat();">
                <div class="chat_img">
                  <img :src="user.avatar" alt="#" />
                </div>
                <div class="chat_ib">
                  <h5>
                    {{user.name}}
                    <span class="chat_date">{{user.createdAt._minutes}}</span>
                  </h5>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <div class="mesgs" v-if="group_chat">
          <div class="msg_history">
            <div v-for="message in messages">
              <div :class="[message.author_id===authUser.uid?'sent_msg':'received_msg']">
                <div class="received_withd_msg">
                  <p>{{message.message}}</p>
                  <span class="time_date">{{message.author_name}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input
                @keyup.enter="saveMessage"
                v-model="message"
                type="text"
                class="write_msg"
                placeholder="Type a message"
              />
              <button class="msg_send_btn" type="button">
                <input type="button" @click="saveMessage" />
              </button>
            </div>
          </div>
        </div>
        <div class="mesgs" v-else>
          <div class="msg_history">
            <div v-for="message in private_messages">
              <div :class="[message.sender_uid===authUser.uid?'sent_msg':'received_msg']">
                <div class="received_withd_msg">
                  <p>{{message.message}}</p>
                  <span class="time_date"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input
                @keyup.enter="sendPrivateMessage"
                v-model="private_message"
                type="text"
                class="write_msg"
                placeholder="Type a message"
              />
              <button class="msg_send_btn" type="button">
                <input type="button" @click="sendPrivateMessage" />
              </button>
            </div>
          </div> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase";
// @ is an alias to /src

export default {
  name: "PrivateChat",

  data() {
    return {
      group_chat:true,
      receiver_uid:'',
      message: null,
      private_message:'',
      private_messages:[],
      messages: [],
      authUser: [],
      users:[]
    };
  },
  methods: {
    saveMessage() {
         var updates={};
          var messageData={
                    message: this.message,
                    author_id: this.authUser.uid,
                    author_name:this.authUser.name,
                    createdAt: new Date()
          }
          var postKey=firebase.database().ref().push().key;
          updates['chat/'+postKey]=messageData;
          firebase.database().ref().update(updates).then(()=>{
          })
      this.fetchMessages();
      this.scrollToBottom();
      this.message = null;
    },
    privateChat(){
       this.group_chat = false;
       this.fetchPrivateMessages();
    },
    fetchPrivateMessages() {
           this.private_messages= [];
           var uid1 = this.authUser.uid;
          var uid2 = this.receiver_uid;
          var final_id = '';
          if(uid1 <uid2){
             final_id =  uid1+'-'+uid2;  
          }
          else{
              final_id =  uid2+'-'+uid1;
          }

          firebase.database().ref().child("privateChats/"+final_id).once('value',(snapshot)=>{
          snapshot.forEach((child) => {
          this.private_messages.push(child.val());
          });
          })

         setTimeout(() => {
            this.scrollToBottom();
          }, 500);
    },
    sendPrivateMessage(){
           var updates={};
          var messageData={
                    message: this.private_message,
                    sender_uid: this.authUser.uid,
                    receiver_uid: this.receiver_uid,
                    createdAt: new Date()
          }
          var uid1 = this.authUser.uid;
          var uid2 = this.receiver_uid;
          var final_id = '';
          if(uid1 <uid2){
             final_id =  uid1+'-'+uid2;  
          }
          else{
              final_id =  uid2+'-'+uid1;
          }

          var postKey=firebase.database().ref().push().key;
          updates['privateChats/'+final_id+'/'+postKey]=messageData;
          firebase.database().ref().update(updates).then(()=>{
          })
      this.private_message = null;
      this.fetchPrivateMessages();
    },
    fetchMessages() {
      this.messages = [];
          firebase.database().ref().child('chat/').once('value',(snapshot)=>{
           var chats = snapshot.val();
           var groupMessages = [];
           for(var key in chats){
             var chat=chats[key];
             groupMessages.push(chat);
           }
           this.messages = groupMessages;
          })
          // 0,5s delay
          setTimeout(() => {
            this.scrollToBottom();
          }, 500);
    },
    fetchUsers() {
          firebase.database().ref().child('users/').once('value',(snapshot)=>{
           var users = snapshot.val();
           var allRegisteredUsers = [];
           for(var x in users){
             var user =users[x];
             allRegisteredUsers.push(user);
           }
           this.users = allRegisteredUsers;
          })
    },
    scrollToBottom() {
      let box = document.querySelector(".msg_history");
      box.scrollTop = box.scrollHeight;
    },
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.database().ref().child('users/').once('value',(snapshot)=>{
           var users = snapshot.val();
           for(var x in users){
             var dbuser =users[x];
             if(dbuser.email == user.email){
                   this.authUser = dbuser;
             }
           }
          })
      } else {
        this.authUser = [];
      }
    });
    this.fetchMessages();
    this.fetchUsers();
    
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

<style scoped="">

.headerName{
  padding-top: 10px;
  padding-bottom: 5px;
}

.container {
  max-width: 1170px;
  margin: auto;
}
img {
  max-width: 100%;
}


.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%;
  border-right: 1px solid #c4c4c4;
  margin-bottom: -50px;
}
.inbox_msg {
  border: 1px solid #c4c4c4;

  clear: both;
  overflow: hidden;
}
.top_spac {
  margin: 20px 0 0;
}

.recent_heading {
  float: left;
  width: 40%;
}

.headind_srch {
  padding: 10px 29px 10px 20px;
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;
}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}

.chat_ib h5 {
  font-size: 18px;
  color: #464646;
  margin: 0 0 8px 0;
}
.chat_ib h5 span {
  float: right;
}
.chat_ib p {
  font-size: 148px;
  color: #989898;
  margin: auto;
}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  padding-top: 10px;
  width: 88%;
  padding-right: 40px;

}


.chat_people {
  overflow: hidden;
  clear: both;
}
.chat_list {
  cursor: pointer;
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat {
  height: 550px;
  overflow-y: scroll;
}

.active_chat {
  background: #ebebeb;
}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}
.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg {
  width: 57%;
}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

.sent_msg p {
  background: #41B3A3 none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}
.sent_msg {
  float: right;
  width: 51%;
}
.input_msg_write input {
  background: rgba(138, 3, 3, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}
.msg_send_btn {
  background: #41B3A3 none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 8px;
  width: 33px;
}
.msg_send_btn input {
  cursor: pointer;cursor: pointer;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  height: 20px !important;
  position: absolute;
  right: 0;
  top: -10px;
  width: 33px;
}

.messaging {
  padding: 0 0 50px 0;
}
.msg_history {
  height: 516px;
  overflow-y: auto;
}
</style>

