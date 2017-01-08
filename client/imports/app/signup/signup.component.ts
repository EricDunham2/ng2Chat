import { Component } from '@angular/core';
import signupTemplate from './signup.component.html';
import signupStyle from './signup.component.scss';
 
@Component({
  selector: 'signup',
  template: signupTemplate,
  styles:[signupStyle]
})

export class SignupComponent{
    constructor() {
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
                        "font-size": "25px",
                        })
                    });
                }
            });
        });
    }
}