import { controlPath } from '@angular/forms/src/directives/shared';
import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
/*
 * custom validators
 */
@Injectable()
export class ValidatorService {

    /*usernameValidator(control: FormControl) {
        Meteor.call("checkAvailability", control.value, function(err, res) {
            if (err) { console.log("Error"); return; }
            if (res == true)
                return { invalidUsername: true };
            else
                return null;
        })

    }*/


    emailValidator(control: FormControl) {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (!EMAIL_REGEXP.test(control.value)) {
            return { invalidEmail: true };
        } else {
            return null;
        }
    }

    passwordValidator(control: FormControl) {
        var PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i;
        if (!PASSWORD_REGEXP.test(control.value)) {
            return { invalidPassword: true };
        } else {
            return null;
        }
    }
}