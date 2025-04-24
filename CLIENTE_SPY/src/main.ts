import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { WelcomeComponent } from './app/pages/welcome/welcome.component';
import { LoginComponent } from './app/pages/login/login.component';
import { RegisterComponent } from './app/pages/register/register.component';
import { UserPorfileComponent } from './app/pages/user-porfile/user-porfile.component';
import { EditProfileComponent } from './app/pages/user-porfile/edit-profile/edit-profile.component';
import { CommentsComponent } from './app/pages/comments/comments.component';
import { BestOfferComponent } from './app/pages/best-offer/best-offer.component';
import { BuyMembershipComponent } from './app/pages/buy-membership/buy-membership.component';
import { PrivacyPoliciesComponent } from './app/pages/privacy-policies/privacy-policies.component';
import { TermsAndConditionsComponent } from './app/pages/terms-and-conditions/terms-and-conditions.component';
import { PaymentGatewayComponent } from './app/pages/payment-gateway/payment-gateway.component';
import { SearchForParkingSpacesComponent } from './app/pages/search-for-parking-spaces/search-for-parking-spaces.component';
import { BestOfferHistoryComponent } from './app/pages/best-offer/best-offer-history/best-offer-history.component';
import { PendingPaymentHistoryComponent } from './app/pages/pending-payment-history/pending-payment-history.component';
import { ParkingHistoryComponent } from './app/pages/parking-history/parking-history.component';
import { ParkingRegistrationComponent } from './app/pages/parking-registration/parking-registration.component';
import { LatePaymentsComponent } from './app/pages/late-payments/late-payments.component';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { VehicleRegistrationComponent } from './app/pages/vehicle-registration/vehicle-registration.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'welcome', component: WelcomeComponent, },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      {
        path: 'dashboard', component: DashboardComponent,
        children: [
          {
            path: 'user-porfile', component: UserPorfileComponent
          },
          {
            path: 'parking-registration', component: ParkingRegistrationComponent
          },
          {
            path: 'parking-history', component: ParkingHistoryComponent
          },
          {
            path: 'search-for-parking-space', component: SearchForParkingSpacesComponent
          },
          {
            path: 'best-offer', component: BestOfferComponent
          },
          {
            path: 'best-offer-history', component: BestOfferHistoryComponent
          },
          {
            path: 'payment-gateway', component: PaymentGatewayComponent
          },
          {
            path: 'buy-membership', component: BuyMembershipComponent
          },
          {
            path: 'pending-payment-history', component: PendingPaymentHistoryComponent
          },
          {
            path: 'late-payments', component: LatePaymentsComponent
          },
          {
            path: 'comments', component: CommentsComponent
          },
          {
            path: 'privacy-policies', component: PrivacyPoliciesComponent
          },
          {
            path: 'terms-and-conditions', component: TermsAndConditionsComponent
          },
        ]
      },
      { path: 'user-porfile', component: UserPorfileComponent,
        children: [
          {
            path: 'edit-profile', component: EditProfileComponent
          },
          {
            path: 'vehicle-registration', component: VehicleRegistrationComponent
          },
        ]
      },
      { path: 'privacy-policies', component: PrivacyPoliciesComponent },
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    ]),
    provideAnimations(),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
