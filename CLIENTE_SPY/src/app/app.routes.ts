import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserPorfileComponent } from './pages/user-profile/user-profile.component';

export const routes: Routes = [
    {path: '/welcome', component: WelcomeComponent},
    {path: '/login', component: LoginComponent},
    {path: '/register', component: RegisterComponent},
    {path: '/user-profile', component: UserPorfileComponent},
];
