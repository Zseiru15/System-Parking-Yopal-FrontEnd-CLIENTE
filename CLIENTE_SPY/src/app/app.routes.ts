import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { EditVehicleComponent } from './pages/vehicle-registration/edit-vehicle/edit-vehicle.component';
import { EditParkingProfileComponent } from './pages/parking-profile/edit-parking-profile/edit-parking-profile.component';

export const routes: Routes = [
    { path: 'edit-vehicle', component: EditVehicleComponent },
    { path: 'edit-parking-profile', component: EditParkingProfileComponent },
    { path: 'welcome', component: WelcomeComponent },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        children: [

            {
                path: 'user-porfile',
                loadComponent: () => import('./pages/user-porfile/user-porfile.component').then(m => m.UserPorfileComponent),
                canActivate: [authGuard],
                canActivateChild: [authGuard],
                children: [
                    {
                        path: 'edit-profile',
                        loadComponent: () => import('./pages/user-porfile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'parking-profile',
                        loadComponent: () => import('./pages/parking-profile/parking-profile.component').then(m => m.ParkingProfileComponent),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'vehicle-registration',
                        loadComponent: () => import('./pages/vehicle-registration/vehicle-registration.component').then(m => m.VehicleRegistrationComponent),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'edit-vehicle',
                        loadComponent: () => import('./pages/vehicle-registration/vehicle-registration.component').then(m => m.VehicleRegistrationComponent),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'parking-registration',
                        loadComponent: () => import('./pages/parking-profile/parking-registration/parking-registration.component').then(m => m.ParkingRegistrationComponent),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'edit-parking-profile',
                        loadComponent: () => import('./pages/parking-profile/edit-parking-profile/edit-parking-profile.component').then(m => m.EditParkingProfileComponent),
                        canActivate: [authGuard]
                    },
                ]
            },
            {
                path: 'parking-history',
                loadComponent: () => import('./pages/parking-history/parking-history.component').then(m => m.ParkingHistoryComponent),
                canActivate: [authGuard]
            },
            {
                path: 'search-for-parking-spaces',
                loadComponent: () => import('./pages/search-for-parking-spaces/search-for-parking-spaces.component').then(m => m.SearchForParkingSpacesComponent),
                canActivate: [authGuard]
            },
            {
                path: 'best-offer',
                loadComponent: () => import('./pages/best-offer/best-offer.component').then(m => m.BestOfferComponent),
                canActivate: [authGuard]
            },
            {
                path: 'best-offer-history',
                loadComponent: () => import('./pages/best-offer/best-offer-history/best-offer-history.component').then(m => m.BestOfferHistoryComponent),
                canActivate: [authGuard]
            },
            {
                path: 'payment-gateway',
                loadComponent: () => import('./pages/payment-gateway/payment-gateway.component').then(m => m.PaymentGatewayComponent),
                canActivate: [authGuard]
            },
            {
                path: 'buy-membership',
                loadComponent: () => import('./pages/buy-membership/buy-membership.component').then(m => m.BuyMembershipComponent),
                canActivate: [authGuard]
            },
            {
                path: 'pending-payment-history',
                loadComponent: () => import('./pages/pending-payment-history/pending-payment-history.component').then(m => m.PendingPaymentHistoryComponent),
                canActivate: [authGuard]
            },
            {
                path: 'late-payments',
                loadComponent: () => import('./pages/late-payments/late-payments.component').then(m => m.LatePaymentsComponent),
                canActivate: [authGuard]
            },
            {
                path: 'comments',
                loadComponent: () => import('./pages/comments/comments.component').then(m => m.CommentsComponent),
                canActivate: [authGuard]
            },
        ]
    },
    {
        path: 'privacy-policies',
        loadComponent: () => import('./pages/privacy-policies/privacy-policies.component').then(m => m.PrivacyPoliciesComponent),
    },
    {
        path: 'terms-and-conditions',
        loadComponent: () => import('./pages/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent),
    },
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'welcome'
    }
];
