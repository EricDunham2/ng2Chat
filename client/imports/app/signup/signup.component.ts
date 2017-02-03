import { Component } from '@angular/core';
import signupTemplate from './signup.component.html';
import signupStyle from './signup.component.scss';
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ValidatorService } from '../validator.service';
import { Router } from "@angular/router";

@Component({
  selector: 'signup',
  template: signupTemplate,
  styles:[signupStyle]
})

export class SignupComponent{
    mismatchPasswords = true;

    checkPasswords(){
        if(this.frmpassword.value != this.frmpasswordrepeat.value){this.mismatchPasswords = false; return;}
        this.mismatchPasswords = true;
    }

    sumbitUser(){
        var proxy = this;
        Meteor.call("createUser",this.frmusername.value,this.frmpassword.value,this.frmemail.value, function(err,res){
            if (err) {console.log(err)}
            else{
                proxy._router.navigate(['/login'], {queryParams: {}});
            }
        });
    }

    signupForm: FormGroup;
    frmusername: FormControl;
    frmpassword: FormControl;
    frmpasswordrepeat: FormControl;
    frmemail: FormControl;  
    
    constructor(private builder: FormBuilder,private validators: ValidatorService, private _router: Router) {
        this.frmusername = new FormControl("", Validators.compose([Validators.required/*, validators.usernameValidator*/]));
        this.frmpassword = new FormControl("", Validators.compose([Validators.required, validators.passwordValidator]));
        this.frmpasswordrepeat = new FormControl("", Validators.compose([Validators.required]));
        this.frmemail = new FormControl("", Validators.compose([Validators.required, validators.emailValidator]));
        this.signupForm = this.builder.group({
            frmusername: this.frmusername,
            frmpassword: this.frmpassword,
            frmpasswordrepeat: this.frmpasswordrepeat,
            frmemail: this.frmemail,
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


    } // constructor
}