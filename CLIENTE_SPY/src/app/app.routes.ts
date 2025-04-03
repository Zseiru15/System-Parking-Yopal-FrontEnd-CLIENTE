import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PrivacyPoliciesComponent } from './pages/privacy-policies/privacy-policies.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'privacy-policies', component: PrivacyPoliciesComponent}
];
