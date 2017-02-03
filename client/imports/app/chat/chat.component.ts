import { Notification } from 'rxjs/Rx';
import { Component, NgZone } from '@angular/core';
import chatTemplate from './chat.component.html';
import chatStyle from './chat.component.scss';
import { Observable } from 'rxjs/Observable';
import { GroupInterface } from './group';
import { FormsModule } from "@angular/forms";
import { ModalModule } from 'ng2-bootstrap/modal';
import { Router } from "@angular/router";

@Component({
    selector: 'chat',
    template: chatTemplate,
    styles: [chatStyle],
})

export class ChatComponent {
    num: number;
    msgContent: string;
    messageListener: any;
    notificationListener: any;
    messages: Observable < any[] > ;
    globalGroups: Observable < GroupInterface[] > ;
    multimedia: any = null;
    username: string = Session.get("username");
    inviteUsr:string;
    newGroupName:string;
    selectedGroup: any;
    newChannel : string;
    selectedNotifaction : any;
    notifications:any[];

    constructor(private _ngZone: NgZone, private _router: Router) {
        this.num = 1;
        this.notifications = []
        let proxy = this;

        Meteor.call("authenticate",this.username,Session.get("token"), function(err,res){
            if (err){
                _router.navigate(['/login']);
                return;
            }
            proxy.getNotifications();
            proxy.getGroups()
        })
    }

    getGroups() {
        let proxy = this;
        Meteor.call("getGroups", Session.get("username"), Session.get("token"), function(error, result) {
            if (error) { console.log("Error - Groups"); return; } else {
                proxy.globalGroups = result;
                let i = 0;
                proxy.globalGroups.forEach(function(group) {
                    Meteor.call("getChannels", group.grpID, Session.get("username"), Session.get("token"), function(error, result) {
                        if (error) { console.log("Error - Channels"); return; }
                        proxy._ngZone.run(() => { proxy.globalGroups[i].Channels = result;++i });
                    })
                })
            }
        })
    }

    send() {
        if (this.msgContent != "") {
            Meteor.call('sendMessage', Session.get("username"), Session.get("chnnlID"), this.msgContent, this.multimedia); //if it is call method sendMessage, Gets the text box value and passes as a parameter !use ID rather then a class to identify, also get name, channel, and create a timestamp
            this.msgContent = "";
            $(".message-pane").animate({ scrollTop: $('.message-pane').prop("scrollHeight") }, 200);
        }
    }

    setGroup(group){
        this.selectedGroup = group;
    }

    getNotifications() {
        let proxy = this;
        this.notificationListener = new MysqlSubscription('getNotifications',proxy.username);
        this.notificationListener.addEventListener('update', function(diff, data) {
            proxy._ngZone.run(() => { proxy.notifications = data });
        });
        this.notificationListener.reactive();
    }

    getChannelMessages(chnnlID) {
        let proxy = this;
        Session.set("chnnlID", chnnlID);
        this.messageListener = new MysqlSubscription('channelMessages', this.num, chnnlID);
        this.messageListener.addEventListener('update', function(diff, data) {
            proxy._ngZone.run(() => { proxy.messages = data });
        });
        this.messageListener.reactive();
    }



    createGroup(){
        let proxy = this;
        Meteor.call('createGroup',proxy.newGrpName,Session.get("username"),function(err,res){
            if(err){return}
            proxy.getGroups();
        })
    }
    
    groupSettingsFunc(){
        let proxy = this;
        if(this.inviteUsr)
            Meteor.call('inviteUserToGroup',this.selectedGroup,this.inviteUsr);
        if(this.newGroupName)
            Meteor.call('renameGroup',this.selectedGroup.grpID,this.newGroupName,function(err,res){
                if(err){return;}
                proxy.getGroups();
                this.newGroupName = "";
            });
        if(this.newChannel)
            Meteor.call('createChannel',this.selectedGroup.grpID,this.newChannel,function(err,res){
                if(err){return;}
                proxy.getGroups();
                this.newChannel = "";
            });
    }

    acceptInvite(){
        let proxy = this;
        Meteor.call('acceptInvite',this.selectedNotifaction,this.username, function(err, res){
            if(err){return}
            proxy.getNotifications();
            proxy.getGroups();
        })
    }

    setNotification(notif){
        this.selectedNotifaction = notif;
    }
}