import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  commentForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {

    this.commentForm = this.fb.group({
      userName: ['', Validators.required],
      parkingName: ['', Validators.required],
      comment: ['', Validators.required],
      classification: ['', Validators.required],
    })
  }

  comment(){

  }

  goToLogin() {
    console.log('Boton de registro clickeado');
    this.router.navigate(['/login']);
  }

  goToregister() {
    console.log('Boton de registro clickeado');
    this.router.navigate(['/register']);
  }
}
