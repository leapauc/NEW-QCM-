import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
} from '@angular/forms';
import { QcmService } from '../../../services/qcm.service';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS
import { QCM } from '../../../models/qcm';
import { ModalComponent } from '../../../components/modal_success_failure/modal.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { SearchBarComponent } from '../../../components/search_bar/search_bar.component';

/**
 * @module ModificationQcmQuestionComponent
 * @description
 * Composant pour modifier les QCM et leurs questions/réponses.
 *
 * Fonctionnalités principales :
 * - Liste les QCM existants avec pagination.
 * - Permet de sélectionner un QCM pour éditer ses questions et réponses.
 * - Gestion dynamique des réponses (ajout/suppression) avec contraintes min/max.
 * - Validation avant soumission : chaque question doit avoir au moins une réponse correcte.
 * - Soumission des modifications au backend via QcmService.
 * - Affichage des modals Bootstrap pour succès/échec.
 *
 * @example
 * <app-modification-qcm-question></app-modification-qcm-question>
 */
@Component({
  selector: 'app-modification-qcm-question',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalComponent,
    PaginationComponent,
    RouterLink,
    SearchBarComponent,
  ],
  templateUrl: './modification-qcm-question.component.html',
})
export class ModificationQcmQuestionComponent implements OnInit {
  /**
   * Liste complète des QCM récupérés depuis le backend
   */
  qcms: QCM[] = [];
  /**
   * QCM actuellement sélectionné pour modification
   */
  selectedQcm: QCM | null = null;
  /**
   * Formulaire réactif pour la modification des questions et réponses
   */
  qcmForm!: FormGroup;
  /** Pagination */
  paginatedQcms: QCM[] = [];
  /**
   * Page actuelle pour la pagination
   */
  currentPage = 1;
  /**
   * Nombre d’éléments par page pour la pagination
   */
  pageSize = 5;
  /**
   * Nombre maximum de réponses par question
   */
  maxResponses = 5;
  /**
   * Nombre minimum de réponses par question
   */
  minResponses = 2;
  /**
   * Indique si les données sont en cours de chargement
   */
  isLoading = true;
  /**
   * Liste des QCM filtrés après recherche.
   */
  filteredQcms: QCM[] = [];
  /**
   * Terme de recherche saisi dans la barre de recherche.
   */
  searchTerm = '';

  /**
   * Constructeur du composant
   * @param qcmService Service pour récupérer et modifier les QCM
   * @param fb FormBuilder pour créer les formulaires réactifs
   * @param cdr ChangeDetectorRef pour déclencher manuellement la détection des changements
   */
  constructor(
    private qcmService: QcmService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Lifecycle hook : appelé après l'initialisation du composant
   * Charge tous les QCM
   */
  ngOnInit(): void {
    this.loadQCMs();
  }

  /**
   * Charge tous les QCM depuis le backend et met à jour l'état de chargement
   */
  loadQCMs() {
    this.isLoading = true;
    this.qcmService.getAllQCM().subscribe({
      next: (data) => {
        this.qcms = data; // ✅ garder la liste complète ici
        this.filteredQcms = [...this.qcms]; // ✅ copie pour affichage/filtrage

        Promise.resolve().then(() => {
          this.paginatedQcms = this.filteredQcms.slice(0, this.pageSize);
          this.cdr.detectChanges();
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement QCM', err);
        this.isLoading = false;
      },
    });
  }

  /**
   * Sélectionne un QCM pour modification.
   * Récupère les questions et réponses associées
   * @param qcm QCM sélectionné
   */
  editQCM(qcm: QCM) {
    this.qcmService.getQcmQuestionsWithResponses(qcm.id_qcm!).subscribe({
      next: (questions) => {
        this.selectedQcm = { ...qcm, questions };
        this.initForm();
      },
      error: (err) => console.error('Erreur chargement questions', err),
    });
  }

  // ---------- Formulaire réactif ----------
  /**
   * Initialise le formulaire réactif pour le QCM sélectionné
   * Crée les FormArray pour questions et réponses
   */
  initForm() {
    this.qcmForm = this.fb.group({
      title: [this.selectedQcm?.title, Validators.required],
      description: [this.selectedQcm?.description],
      questions: this.fb.array([]),
    });

    this.selectedQcm?.questions?.forEach((q: any) => {
      const questionGroup = this.fb.group({
        id_question: [q.id_question],
        question: [q.question, Validators.required],
        type: [q.type || 'single'],
        responses: this.fb.array([]),
      });

      // Parcourir le tableau responses (tableau d'objets)
      q.responses.forEach((r: any) => {
        (questionGroup.get('responses') as FormArray).push(
          this.fb.group({
            id_response: [r.id_response],
            response: [r.response, Validators.required],
            is_correct: [r.is_correct],
            position: [r.position],
          })
        );
      });

      (this.qcmForm.get('questions') as FormArray).push(questionGroup);
    });
  }

  /** Retourne le FormArray des questions */
  get questions(): FormArray {
    return this.qcmForm.get('questions') as FormArray;
  }

  /** Retourne le FormArray des réponses d’une question donnée */
  getResponses(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('responses') as FormArray;
  }

  /**
   * Ajoute une réponse à une question
   * @param questionIndex Index de la question
   */
  addResponse(questionIndex: number) {
    const responses = this.getResponses(questionIndex);
    if (responses.length < this.maxResponses) {
      responses.push(
        this.fb.group({
          response: ['', Validators.required],
          is_correct: [false],
          position: [responses.length + 1],
        })
      );
    }
  }

  /**
   * Supprime une réponse d’une question
   * @param questionIndex Index de la question
   * @param responseIndex Index de la réponse
   */
  removeResponse(questionIndex: number, responseIndex: number) {
    const responses = this.getResponses(questionIndex);
    if (responses.length > this.minResponses) {
      responses.removeAt(responseIndex);
    }
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

  // ---------- Sauvegarde ----------
  /**
   * Valide et soumet le formulaire au backend.
   * Vérifie que chaque question a au moins une réponse correcte.
   * Affiche les modals de succès/échec.
   */
  submitForm() {
    if (this.qcmForm.invalid || !this.selectedQcm) {
      this.qcmForm.markAllAsTouched();
      return;
    }

    const formValue = this.qcmForm.value;

    // ✅ Vérifier que chaque question a au moins une réponse correcte
    for (const q of formValue.questions) {
      const hasCorrect = q.responses.some((r: any) => r.is_correct);
      if (!hasCorrect) {
        const modalEl = document.getElementById('unvalidModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
        return; // arrêter la soumission
      }
    }

    // ✅ Soumission au backend
    this.qcmService
      .updateQCM_Question(this.selectedQcm.id_qcm!, formValue)
      .subscribe({
        next: (res) => {
          const modalEl = document.getElementById('successModal');
          if (modalEl) new bootstrap.Modal(modalEl).show();

          // Réinitialiser formulaire et sélection
          this.selectedQcm = null;
          this.qcmForm.reset();
          this.loadQCMs();
        },
        error: (err) => {
          const modalEl = document.getElementById('failedModal');
          if (modalEl) new bootstrap.Modal(modalEl).show();
        },
      });
  }

  /** Réinitialise le formulaire pour le QCM sélectionné */
  resetForm() {
    if (this.selectedQcm) {
      this.initForm();
    }
  }

  /** Annule la modification et réinitialise le formulaire */
  cancelForm() {
    this.selectedQcm = null;
    this.qcmForm.reset();
  }
}
