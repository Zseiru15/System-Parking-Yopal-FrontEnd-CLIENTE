import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-privacy-policies',
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './privacy-policies.component.html',
  styleUrl: './privacy-policies.component.css'
})
export class PrivacyPoliciesComponent {

}
