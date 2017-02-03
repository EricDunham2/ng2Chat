import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { Routing } from './app.routing';
import { ReactiveFormsModule } from "@angular/forms"; // model driven forms
import { ValidatorService } from "./validator.service";
import { FormsModule } from "@angular/forms";
import { ModalModule } from 'ng2-bootstrap/modal';

@NgModule({
  imports       :    [BrowserModule,ReactiveFormsModule,Routing,FormsModule,ModalModule.forRoot()],
  declarations  :    [AppComponent,HomeComponent,SignupComponent,LoginComponent,ChatComponent],
  providers     :    [ValidatorService],
  bootstrap     :    [AppComponent]
})

export class AppModule {}