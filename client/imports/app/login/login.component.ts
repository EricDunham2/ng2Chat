//import * as session from 'Session';
import { Component } from '@angular/core';
import loginTemplate from './login.component.html';
import loginStyle from './login.component.scss';
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ValidatorService } from '../validator.service';
import { Session } from 'meteor/session';
import { Router } from "@angular/router";

@Component({
  selector: 'login',
  template: loginTemplate,
  styles:[loginStyle]
})

export class LoginComponent{
    loginForm: FormGroup;
    frmusername: FormControl;
    frmpassword: FormControl;
    router: Router;
    
    login(){
        let router = this.router
        var proxy = this;
       Meteor.call("login",this.frmusername.value,this.frmpassword.value, function(error,result){
            if( error ) {
                 console.log("Error - login"); 
                 return; 
                }
            else{
                 Session.set('token',result);
                 Session.set('username',proxy.frmusername.value);
                 router.navigate(['/chat'], {queryParams: {}});
                }
       });
    }

    constructor(private builder: FormBuilder,private validators: ValidatorService,  private _router: Router) {
        this.router = _router; 
        this.frmusername = new FormControl("", Validators.compose([Validators.required, validators.usernameValidator]));
        this.frmpassword = new FormControl("", Validators.compose([Validators.required, validators.passwordValidator]));
        this.loginForm = this.builder.group({
            frmusername: this.frmusername,
            frmpassword: this.frmpassword,
        });

        $(function() {
                    $(".input-group input").focus(function() {

                        $(this).parent(".input-group").each(function() {
                            $("label", this).css({
                                "font-size": "15px",
                            })
                        });
                    }).blur(function() {
                        if ($(this).val() == "") {
                            $(this).parent(".input-group").each(function() {
                                $("label", this).css({
                                "font-size": "20px",
                                })
                            });
                        }
                    });
                });
    }
}