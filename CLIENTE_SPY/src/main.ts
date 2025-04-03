
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/pages/login/login.component';
import { RegisterComponent } from './app/pages/register/register.component';
import { PrivacyPoliciesComponent } from './app/pages/privacy-policies/privacy-policies.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent,{
    providers:[
        provideRouter([
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'privacy-policies', component: PrivacyPoliciesComponent },
          ]),
        provideAnimations(),
        provideHttpClient()
    ]
}).catch(err => console.error(err));
