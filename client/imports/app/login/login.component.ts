import { Component } from '@angular/core';
import loginTemplate from './login.component.html';
import loginStyle from './login.component.scss';
 
@Component({
  selector: 'signup',
  template: loginTemplate,
  styles:[loginStyle]
})

export class LoginComponent{
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