import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-gateway',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent {

  paymentForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {


    this.paymentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      cardType: ['', Validators.required],
      currency: ['', Validators.required],
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      expirationDate: ['', Validators.required],
      cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    })
  }

  makePayment() {
    if (this.paymentForm.valid) {
      console.log('Payment Successful')
      const formData = this.paymentForm.value;
      console.log('Payment Data', formData)
    } else {
      console.log('Form is invalid');
    }
  }

}
