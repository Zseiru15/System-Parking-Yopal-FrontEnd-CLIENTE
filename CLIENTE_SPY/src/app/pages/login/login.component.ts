import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; // Ajusta según estructura
import { MidService } from '../../../services/mid.service';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hidePassword = true;
  loginForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private midService: MidService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  }

  login() {
    if (this.loginForm.invalid) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const data = this.loginForm.value;

    this.midService.loginUser(data).subscribe({
      next: (res: any) => {
        if (res.Success) {
          console.log('Respuesta login:', res.Data);
          localStorage.setItem('usuario', JSON.stringify(res.Data));
          this.router.navigate(['/dashboard']);
        } else {
          alert(res.Message || 'Login fallido');
        }
      },
      error: (err: any) => {
        console.error('❌ Error de login:', err);
        alert('Error al iniciar sesión');
      }
    });

  }

  goToRegister() {
    console.log('Boton de registro clickeado');
    this.router.navigate(['/register']);
  }

  recoverPassword() {
    alert('Recuperacion Contraseña')
  }

  createAccount() {
    this.router.navigate(['/register']);
  }

}
