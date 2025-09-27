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
import * as bootstrap from 'bootstrap';
import { QuizAttemptsService } from '../../../services/quiz_attempts.service';
import { AuthService } from '../../../services/auth.service';
import { AuthUser } from '../../../models/authUser';
import { AttemptPayload } from '../../../models/attemptPayload';
import { QCM } from '../../../models/qcm';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

/**
 * Composant de sélection et d'exécution d'un QCM.
 *
 * Permet à un stagiaire de :
 * - Consulter la liste des QCM disponibles
 * - Filtrer et rechercher un QCM
 * - Sélectionner un QCM et répondre aux questions
 * - Soumettre ses réponses et recevoir un score
 * - Naviguer entre les pages pour réaliser plusieurs QCM
 *
 * Utilise `QcmService` pour récupérer les QCM, `QuizAttemptsService` pour sauvegarder les tentatives
 * et `AuthService` pour obtenir l'utilisateur courant.
 *
 * @example
 * ```html
 * <app-choix-qcm></app-choix-qcm>
 * ```
 */
@Component({
  selector: 'app-choix-qcm',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationComponent,
  ],
  templateUrl: './choix-qcm.component.html',
})
export class ChoixQcmComponent implements OnInit {
  /** Liste complète des QCM disponibles */
  qcms: QCM[] = [];
  /** QCM actuellement sélectionné */
  selectedQcm: QCM | null = null;
  /** Formulaire réactif pour le QCM */
  qcmForm!: FormGroup;
  /** Pagination */
  paginatedQCM: QCM[] = [];
  /** ID de l'utilisateur authentifié */
  authIdUser = 0;
  /** Date/heure de début du QCM */
  startTime = '';
  /** Date/heure de fin du QCM */
  endTime = '';
  /** Affichage du modal de succès */
  showSuccessModal = false;
  /** Message affiché dans le modal de succès */
  successMessage = '';
  /** Affichage du modal d'échec */
  showFailedModal = false;
  /** Message affiché dans le modal d'échec */
  failedMessage = '';
  /** Liste filtrée des QCM (après recherche) */
  filteredQcms: QCM[] = [];
  /** Terme de recherche pour filtrer les QCM */
  searchTerm = '';
  /** Réponses sélectionnées par l'utilisateur */
  selectedAnswers: { id_question: number; id_response: number }[] = [];

  /**
   * Constructeur du composant `ChoixQcmComponent`.
   *
   * @param qcmService Service pour récupérer les QCM disponibles
   * @param fb FormBuilder pour créer et manipuler les formulaires réactifs
   * @param quizAttemptsService Service pour sauvegarder les tentatives de QCM
   * @param authService Service pour obtenir les informations de l'utilisateur courant
   * @param cdr ChangeDetectorRef pour déclencher manuellement la détection des changements
   */
  constructor(
    private qcmService: QcmService,
    private fb: FormBuilder,
    private quizAttemptsService: QuizAttemptsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  /** Lifecycle hook : appelé après l'initialisation du composant */
  ngOnInit(): void {
    this.loadQCMs();
  }

  /** Charge tous les QCM depuis le backend et initialise la liste filtrée */
  loadQCMs() {
    const currentUser: AuthUser | null = this.authService.getUser();
    if (!currentUser) return;

    this.authIdUser = currentUser.id_user;
    this.qcmService.getAllQCM().subscribe({
      next: (data) => {
        this.qcms = data;
        this.filteredQcms = [...this.qcms];

        // 🔹 éviter ExpressionChangedAfterItHasBeenCheckedError
        Promise.resolve().then(() => {
          this.paginatedQCM = this.filteredQcms.slice(0, 5);
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Erreur chargement QCM', err),
    });
  }

  /**
   * Sélectionne un QCM et initialise le formulaire pour répondre aux questions.
   * Le formulaire s'ouvre dans un modal Bootstrap afin de répondre au QCM.
   * @param qcm QCM sélectionné
   */
  editQCM(qcm: QCM) {
    this.qcmService.getQcmQuestionsWithResponses(qcm.id_qcm!).subscribe({
      next: (questions) => {
        this.selectedQcm = { ...qcm, questions };
        this.initForm();

        // ✅ Stocker la date de début ici
        this.startTime = new Date().toISOString(); // <-- ajout
        console.log(this.startTime);
        const modalEl = document.getElementById('qcmModal');
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      },
      error: (err) => console.error('Erreur chargement questions', err),
    });
  }

  /**
   * Gestionnaire pour la sélection d'une réponse à une question.
   * Met à jour le tableau `selectedAnswers` selon le type de question (single/multiple).
   */
  onAnswerSelect(
    qIndex: number,
    id_response: number,
    event: Event,
    type: string
  ) {
    const id_question = this.questions.at(qIndex).get('id_question')?.value;
    const checked = (event.target as HTMLInputElement).checked;

    if (type === 'single') {
      // Supprime toute réponse existante pour cette question
      this.selectedAnswers = this.selectedAnswers.filter(
        (a) => a.id_question !== id_question
      );
      if (checked) {
        this.selectedAnswers.push({ id_question, id_response });
      }
    } else {
      // pour les checkbox, on ajoute ou retire
      if (checked) {
        this.selectedAnswers.push({ id_question, id_response });
      } else {
        this.selectedAnswers = this.selectedAnswers.filter(
          (a) =>
            !(a.id_question === id_question && a.id_response === id_response)
        );
      }
    }
  }

  // ---------- Formulaire réactif ----------
  /** Initialise le formulaire réactif à partir du QCM sélectionné */
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

      // ✅ Ajout des réponses depuis le back
      q.responses.forEach((resp: any) => {
        (questionGroup.get('responses') as FormArray).push(
          this.fb.group({
            id_response: [resp.id_response],
            response: [resp.response, Validators.required],
            is_correct: [resp.is_correct],
            position: [resp.position],
            selected: [false],
          })
        );
      });

      (this.qcmForm.get('questions') as FormArray).push(questionGroup);
    });
  }

  /** Retourne le tableau FormArray des questions */
  get questions(): FormArray {
    return this.qcmForm.get('questions') as FormArray;
  }

  /** Retourne le FormArray des réponses d'une question */
  getResponses(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('responses') as FormArray;
  }

  // ---------- Sauvegarde ----------
  /** Ouvre le modal de succès avec un message */
  openSuccessModal(message: string) {
    this.successMessage = message;
    this.showSuccessModal = true;
    const modalEl = document.getElementById('successModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  /** Ouvre le modal d'échec avec un message */
  openFailedModal(message: string) {
    this.failedMessage = message;
    this.showFailedModal = true;
    const modalEl = document.getElementById('failedModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  /** Soumet le QCM et sauvegarde la tentative */
  submitForm() {
    if (this.selectedAnswers.length === 0) {
      this.openFailedModal('Veuillez répondre à au moins une question !');
      return;
    }
    if (!this.selectedQcm || this.selectedQcm.id_qcm === undefined) {
      this.openFailedModal('Aucun QCM sélectionné. Veuillez réessayer.');
      return;
    }
    this.endTime = new Date().toISOString();

    const payload: AttemptPayload = {
      id_qcm: this.selectedQcm.id_qcm, // ✅ ici c'est garanti non-undefined
      id_user: this.authIdUser,
      started_at: this.startTime,
      ended_at: this.endTime,
      answers: this.selectedAnswers,
    };

    this.quizAttemptsService.saveAttempt(payload).subscribe({
      next: (res) => {
        this.openSuccessModal(`Votre score : ${res.score.toFixed(2)}%`);
        // ✅ Réinitialiser les réponses et le formulaire
        this.selectedAnswers = [];
        this.qcmForm.reset();
        this.selectedQcm = null;
        this.startTime = '';
        this.endTime = '';

        // ✅ Fermer tous les modals ouverts
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach((modalEl) => {
          const modalInstance =
            bootstrap.Modal.getInstance(modalEl) ||
            new bootstrap.Modal(modalEl);
          modalInstance.hide();
        });
      },
      error: (err) => console.error('Erreur saveAttempt', err),
    });
  }

  /** Réinitialise les réponses sélectionnées et décocher les inputs dans le modal */
  resetAnswers() {
    // 1. Réinitialiser le tableau des réponses sélectionnées (pour cohérence avec la soumission)
    this.selectedAnswers = [];
    // 2. Décocher tous les inputs radio et checkbox dans le modal uniquement
    const modal = document.getElementById('qcmModal');
    if (modal) {
      const inputs = modal.querySelectorAll(
        'input[type="radio"], input[type="checkbox"]'
      );
      inputs.forEach((input) => {
        (input as HTMLInputElement).checked = false;
      });
    }
  }

  /** Applique le filtre de recherche sur la liste des QCM */
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
      this.paginatedQCM = this.filteredQcms.slice(0, 5);
      this.cdr.detectChanges();
    });
  }
}
