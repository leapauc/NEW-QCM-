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

@Component({
  selector: 'app-ajout-qcm',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajout-qcm.component.html',
  styleUrl: './ajout-qcm.component.css',
})
export class AjoutQcmComponent {
  form: FormGroup;

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
