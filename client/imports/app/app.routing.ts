import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { ChatComponent } from "./chat/chat.component";


const appRoutes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "signup", component: SignupComponent },
    { path: "login", component: LoginComponent },
    { path: "chat", component: ChatComponent },
    { path: "", component: HomeComponent},
];
export const Routing = RouterModule.forRoot(appRoutes);
