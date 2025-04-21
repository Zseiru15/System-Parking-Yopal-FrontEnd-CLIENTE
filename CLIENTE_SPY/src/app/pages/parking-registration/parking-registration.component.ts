import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parking-registration',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './parking-registration.component.html',
  styleUrl: './parking-registration.component.css'
})
export class ParkingRegistrationComponent {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {

    this.registerForm = this.fb.group({
      parkingName: ['', Validators.required],
      nit: ['', Validators.required],
      coordinates: ['', Validators.required],
      address: ['', Validators.required],
      cars: ['', Validators.required],
      motorcycles: ['', Validators.required],
      bicycles: ['', Validators.required],
      height: ['', Validators.required],
      type: ['', Validators.required],
      floor: ['', Validators.required],
      shade: ['', Validators.required],
    })
  }

  register(){

  }
}
