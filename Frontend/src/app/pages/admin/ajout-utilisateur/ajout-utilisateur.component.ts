import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS
import { ModalComponent } from '../../../components/modal_success_failure/modal.component';

/**
 * @component
 * @name AjoutUtilisateurComponent
 * @description
 * Composant permettant de créer un nouvel utilisateur via un formulaire réactif.
 *
 * Fonctionnalités principales :
 * - Formulaire avec validation pour :
 *    - Nom (obligatoire)
 *    - Prénom (obligatoire)
 *    - Email (obligatoire et format email valide)
 *    - Société (facultatif)
 *    - Mot de passe (obligatoire, minimum 8 caractères)
 *    - Confirmation du mot de passe (doit correspondre au mot de passe)
 *    - Champ admin (booléen)
 * - Validation personnalisée pour vérifier que le mot de passe et sa confirmation correspondent.
 * - Appel au service `UserService` pour créer l’utilisateur.
 * - Affichage de modals Bootstrap en cas de succès ou d’échec.
 * - Réinitialisation du formulaire après création réussie.
 *
 * @example
 * ```html
 * <app-ajout-utilisateur></app-ajout-utilisateur>
 * ```
 */
@Component({
  selector: 'app-ajout-utilisateur',
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './ajout-utilisateur.component.html',
})
export class AjoutUtilisateurComponent {
  /**
   * Formulaire réactif pour la création d’un utilisateur.
   */
  form: FormGroup;

  /**
   * Constructeur du composant.
   * @param fb FormBuilder pour créer le formulaire réactif.
   * @param userService Service pour gérer les utilisateurs via l’API.
   */
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        firstname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        society: [''],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        admin: [false],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  /**
   * Validator personnalisé pour vérifier que le mot de passe et la confirmation correspondent.
   * @param group AbstractControl représentant le formulaire.
   * @returns null si les mots de passe correspondent, sinon { notMatching: true }.
   */
  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  /**
   * Méthode appelée lors de la soumission du formulaire.
   * - Vérifie la validité du formulaire.
   * - Supprime le champ confirmPassword des données envoyées.
   * - Définit admin à false si non renseigné.
   * - Appelle `userService.createUser` pour créer l’utilisateur.
   * - Affiche un modal Bootstrap en cas de succès ou d’échec.
   * - Réinitialise le formulaire après création réussie.
   */
  onSubmit() {
    if (this.form.valid) {
      const { confirmPassword, ...userData } = this.form.value;
      // Forcer admin à false si vide
      if (!userData.admin) {
        userData.admin = false;
      }

      this.userService.createUser(userData).subscribe({
        next: (user) => {
          console.log('Utilisateur créé', user);
          this.form.reset();

          // Afficher le modal Bootstrap
          const modalEl = document.getElementById('successModal');
          if (modalEl) new bootstrap.Modal(modalEl).show();
        },
        error: (err) => {
          const modalEl = document.getElementById('failedModal');
          if (modalEl) new bootstrap.Modal(modalEl).show();
        },
      });
    } else {
      console.log('Form invalid');
    }
  }
}
