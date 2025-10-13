import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS

/**
 * Composant de connexion à l'application.
 *
 * Ce composant fournit un formulaire de login avec les champs :
 * - Nom d'utilisateur (`name`)
 * - Mot de passe (`password`)
 *
 * Il utilise `AuthService` pour authentifier l'utilisateur et redirige
 * vers l'interface appropriée selon le rôle de l'utilisateur.
 *
 * @example
 * <app-login></app-login>
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  /**
   * Formulaire de connexion réactif.
   * Contient les champs :
   * - `name` : string, requis
   * - `password` : string, requis
   */
  loginForm: FormGroup;

  /**
   * Constructeur du composant.
   *
   * @param fb FormBuilder pour créer le formulaire réactif
   * @param authService Service d'authentification
   * @param router Router pour la navigation après login
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * Méthode appelée lors de la soumission du formulaire.
   *
   * Vérifie la validité du formulaire, puis appelle le service d'authentification.
   * Redirige vers :
   * - `/admin` si l'utilisateur est administrateur
   * - `/stagiaire` sinon
   *
   * Affiche un modal d'alerte en cas d'erreur de connexion.
   */
  onSubmit() {
    if (this.loginForm.invalid) return;

    const { name, password } = this.loginForm.value;

    this.authService.login(name, password).subscribe({
      next: (res) => {
        if (res.user.admin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/stagiaire']);
        }
      },
      error: (err) => {
        const modalEl = document.getElementById('failedModal');
        const modal = new bootstrap.Modal(modalEl!);
        modal.show();
      },
    });
  }
}
