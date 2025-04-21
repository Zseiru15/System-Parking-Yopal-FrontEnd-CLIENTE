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
  hidePassword= true;
  loginForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token); // Aquí el token
          this.router.navigate(['/dashboard']); // Redirección segura
        },
        error: (err) => {
          alert('Credenciales incorrectas o error de servidor');
          console.error('Login error:', err);
        }
      });
    } else {
      alert('Por favor complete todos los campos');
    }
  }

  goToRegister(){
    console.log('Boton de registro clickeado');
    this.router.navigate(['/register']);
  }

  recoverPassword(){
    alert('Recuperacion Contraseña')
  }

  createAccount(){
    this.router.navigate(['/register']);
  }

}
