import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { Routing } from './app.routing';


@NgModule({
  imports:      [BrowserModule,Routing],
  declarations: [AppComponent,HomeComponent,SignupComponent],
  bootstrap:    [AppComponent]
})

export class AppModule {}