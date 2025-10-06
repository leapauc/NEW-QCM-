import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QcmService } from '../../../services/qcm.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
} from '@angular/forms';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS
import { QCM } from '../../../models/qcm';
import { SearchBarComponent } from '../../../components/search_bar/search_bar.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ModalComponent } from '../../../components/modal_success_failure/modal.component';

/**
 * Composant responsable de la modification d'un QCM.
 *
 * @description
 * Ce composant permet :
 * - de charger tous les QCM disponibles depuis le service `QcmService`
 * - de rechercher et filtrer les QCM via une barre de recherche
 * - de sélectionner un QCM pour modification (titre, description)
 * - de soumettre les changements pour mise à jour côté serveur
 * - d'afficher un modal de succès ou d'échec selon le résultat de la mise à jour
 *
 * @usageNotes
 * ### Importation
 * Ce composant utilise :
 * - `CommonModule`, `FormsModule`, `ReactiveFormsModule`
 * - `SearchBarComponent` pour la recherche
 * - `PaginationComponent` pour la pagination
 * - `ModalComponent` pour afficher le succès ou l'échec
 *
 * @example
 * ```html
 * <app-modification-qcm></app-modification-qcm>
 * ```
 *
 * @selector app-modification-qcm
 * @component
 */
@Component({
  selector: 'app-modification-qcm',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SearchBarComponent,
    PaginationComponent,
    ModalComponent,
  ],
  templateUrl: './modification-qcm.component.html',
})
export class ModificationQcmComponent implements OnInit {
  /**
   * Liste complète des QCM récupérés depuis l'API.
   */
  qcms: QCM[] = [];
  /**
   * QCM actuellement sélectionné pour modification.
   */
  selectedQcm: QCM | null = null;
  /**
   * Formulaire réactif pour modifier le titre et la description du QCM.
   */
  qcmForm!: FormGroup;
  /**
   * Nombre maximum de réponses autorisées pour un QCM.
   */
  maxResponses = 5;
  /**
   * Nombre minimum de réponses requises pour un QCM.
   */
  minResponses = 2;
  /**
   * Liste des QCM filtrés après recherche.
   */
  filteredQcms: QCM[] = [];
  /**
   * Terme de recherche saisi dans la barre de recherche.
   */
  searchTerm = '';
  /**
   * QCM affichés sur la page courante (pagination).
   */
  paginatedQcms: QCM[] = [];
  /** Etat chargement des données */
  isLoading = true;

  /**
   * Constructeur du composant.
   * @param qcmService Service de gestion des QCM
   * @param fb FormBuilder pour créer les formulaires réactifs
   * @param cdr ChangeDetectorRef pour forcer la détection des changements après chargement asynchrone
   */
  constructor(
    private qcmService: QcmService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Cycle de vie Angular : Initialisation du composant.
   * Charge les QCM depuis le backend.
   */
  ngOnInit(): void {
    this.loadQCMs();
  }

  /**
   * Récupère tous les QCM via le service et initialise la pagination.
   */
  loadQCMs() {
    this.isLoading = true;
    this.qcmService.getAllQCM().subscribe({
      next: (data) => {
        this.qcms = data;
        this.filteredQcms = [...this.qcms];
        Promise.resolve().then(() => {
          this.paginatedQcms = this.filteredQcms.slice(0, 5);
          this.cdr.detectChanges();
        });
        this.isLoading = false; // ✅ fin du chargement
      },
      error: (err) => {
        console.error('Erreur chargement QCM', err);
        this.isLoading = false;
      },
    });
  }

  /**
   * Sélectionne un QCM et initialise le formulaire avec ses données.
   * @param qcm QCM à modifier
   */
  editQCM(qcm: QCM) {
    // On récupère le QCM complet (title + description)
    this.qcmService.getQCMById(qcm.id_qcm!).subscribe({
      next: (data) => {
        this.selectedQcm = data; // titre et description récupérés
        this.initForm();
      },
      error: (err) => console.error('Erreur chargement QCM', err),
    });
  }
  /**
   * Applique un filtre sur la liste des QCM en fonction du terme de recherche.
   */
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredQcms = [...this.qcms];
    } else {
      this.filteredQcms = this.qcms.filter((qcm) =>
        (qcm.title + qcm.description + qcm.user).toLowerCase().includes(term)
      );
    }

    Promise.resolve().then(() => {
      this.paginatedQcms = this.filteredQcms.slice(0, 5);
      this.cdr.detectChanges();
    });
  }

  // ---------- Formulaire réactif ----------
  /**
   * Initialise le formulaire avec les valeurs du QCM sélectionné.
   */
  initForm() {
    this.qcmForm = this.fb.group({
      title: [this.selectedQcm?.title, Validators.required],
      description: [this.selectedQcm?.description],
    });
  }
  /**
   * Réinitialise le formulaire avec les valeurs originales du QCM.
   */
  resetForm() {
    if (!this.selectedQcm) return;

    // Remet le formulaire à ses valeurs originales récupérées depuis le QCM
    this.qcmForm.patchValue({
      title: this.selectedQcm.title,
      description: this.selectedQcm.description,
    });
  }
  /**
   * Getter pour accéder aux questions sous forme de `FormArray`.
   */
  get questions(): FormArray {
    return this.qcmForm.get('questions') as FormArray;
  }

  // ---------- Sauvegarde ----------
  /**
   * Soumet le formulaire pour mettre à jour le QCM.
   * Affiche un modal de succès ou d'échec en fonction du résultat.
   */
  submitForm() {
    if (this.qcmForm.invalid) {
      this.qcmForm.markAllAsTouched();
      return;
    }

    const formValue = this.qcmForm.value;

    this.qcmService.updateQCM(this.selectedQcm!.id_qcm!, formValue).subscribe({
      next: () => {
        const modalEl = document.getElementById('successModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du QCM :', err);

        if (err.status === 409) {
          // 🟡 Cas du titre déjà existant
          const modalEl = document.getElementById('conflictModal');
          if (modalEl) new bootstrap.Modal(modalEl).show();
        } else {
          // 🔴 Autres erreurs
          const modalEl = document.getElementById('failedModal');
          if (modalEl) new bootstrap.Modal(modalEl).show();
        }
      },
    });
  }

  /**
   * Callback exécuté après la mise à jour d'un QCM pour recharger la liste.
   */
  onQcmUpdated() {
    this.selectedQcm = null;
    this.loadQCMs();
  }

  /**
   * Annule la modification en cours et vide le formulaire.
   */
  cancelEdit() {
    this.selectedQcm = null;
    this.qcmForm.reset(); // (optionnel) pour vider les champs du formulaire
  }
}
