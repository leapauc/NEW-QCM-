import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS
import { QcmService } from '../../../services/qcm.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

/**
 * @component
 * @name AjoutQcmComponent
 * @description
 * Composant permettant à un utilisateur connecté de créer un nouveau QCM.
 *
 * Fonctionnalités principales :
 * - Affichage d’un formulaire réactif pour le titre et la description du QCM.
 * - Validation du formulaire avant l’envoi.
 * - Récupération de l’utilisateur courant via `AuthService`.
 * - Création d’un QCM via le service `QcmService`.
 * - Affichage d’un modal Bootstrap en cas de succès.
 * - Réinitialisation automatique du formulaire après création.
 *
 * @example
 * ```html
 * <app-ajout-qcm></app-ajout-qcm>
 * ```
 */
@Component({
  selector: 'app-ajout-qcm',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajout-qcm.component.html',
})
export class AjoutQcmComponent {
  /**
   * Formulaire réactif pour la création d’un QCM.
   * Contient :
   * - title: Titre du QCM (champ obligatoire)
   * - description: Description du QCM (facultatif)
   */
  form: FormGroup;

  /**
   * Constructeur du composant.
   * @param fb FormBuilder pour créer le formulaire réactif.
   * @param qcmService Service pour interagir avec l’API QCM.
   * @param authService Service pour récupérer l’utilisateur courant.
   */
  constructor(
    private fb: FormBuilder,
    private qcmService: QcmService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  /**
   * Méthode appelée lors de la soumission du formulaire.
   * Fonctionnement :
   * 1. Vérifie si le formulaire est valide.
   * 2. Récupère l’utilisateur connecté via AuthService.
   * 3. Prépare les données du QCM à envoyer au backend.
   * 4. Appelle le service `qcmService.createQCM`.
   * 5. Affiche un modal Bootstrap en cas de succès et réinitialise le formulaire.
   * 6. Log des erreurs en cas de problème.
   */
  onSubmit() {
    if (this.form.valid) {
      // Récupérer l'utilisateur connecté via AuthService
      const currentUser = this.authService.getUser();
      if (!currentUser) {
        console.error('Utilisateur non connecté');
        return;
      }

      // Préparer les données à envoyer au backend
      const qcmData = {
        ...this.form.value,
        created_by: currentUser.id_user || currentUser.id_user, // selon la structure du user
      };

      console.log('Données envoyées au backend:', qcmData); // pour debug

      this.qcmService.createQCM(qcmData).subscribe({
        next: (res: any) => {
          console.log('Réponse serveur:', res);

          // Afficher le modal Bootstrap uniquement si insertion réussie
          if (res && res.qcmId) {
            const modalEl = document.getElementById('successModal');
            const modal = new bootstrap.Modal(modalEl!);
            modal.show();

            // Réinitialiser le formulaire
            this.form.reset();
          } else {
            console.error('Erreur : QCM non créé correctement');
          }
        },
        error: (err) => console.error('Erreur création QCM', err),
      });
    } else {
      console.log('Formulaire invalide');
    }
  }
}
