import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUsuarioActual();
  if (user) {
    return true;
  } else {
    // Mostrar alert de forma no bloqueante
    setTimeout(() => {
      alert('Acceso denegado. Inicia sesión o regístrate para continuar.');
    }, 1000);

    // Redirigir al welcome
    return router.createUrlTree(['/welcome']);
  }
};
