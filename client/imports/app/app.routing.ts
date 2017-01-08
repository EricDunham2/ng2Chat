import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { SignupComponent } from "./signup/signup.component";

const appRoutes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "signup", component: SignupComponent },
    { path: "", component: HomeComponent},
];
export const Routing = RouterModule.forRoot(appRoutes);
