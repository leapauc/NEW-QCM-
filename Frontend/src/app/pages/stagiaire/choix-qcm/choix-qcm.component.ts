import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-choix-qcm',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './choix-qcm.component.html',
})
export class ChoixQcmComponent implements OnInit {
  qcms: QCM[] = [];
  selectedQcm: QCM | null = null;
  qcmForm!: FormGroup;
  currentPage = 1;
  pageSize = 5;
  authIdUser = 0;
  startTime = '';
  endTime = '';
  showSuccessModal = false;
  successMessage = '';
  showFailedModal = false;
  failedMessage = '';
  filteredQcms: QCM[] = [];
  searchTerm = '';

  constructor(
    private qcmService: QcmService,
    private fb: FormBuilder,
    private quizAttemptsService: QuizAttemptsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadQCMs();
  }

  loadQCMs() {
    const currentUser: AuthUser | null = this.authService.getUser();
    if (!currentUser) return;

    this.authIdUser = currentUser.id_user;
    this.qcmService.getAllQCM().subscribe({
      next: (data) => {
        this.qcms = data;
        this.filteredQcms = [...this.qcms];
      },
      error: (err) => console.error('Erreur chargement QCM', err),
    });
  }

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

  selectedAnswers: { id_question: number; id_response: number }[] = [];

  onAnswerSelect(
    qIndex: number,
    id_response: number,
    event: Event,
    type: string
  ) {
    const id_question = this.questions.at(qIndex).get('id_question')?.value;
    const checked = (event.target as HTMLInputElement).checked;

    if (type === 'single') {
      // ❌ Supprime toute réponse existante pour cette question
      this.selectedAnswers = this.selectedAnswers.filter(
        (a) => a.id_question !== id_question
      );
      if (checked) {
        this.selectedAnswers.push({ id_question, id_response });
      }
    } else {
      // ✅ pour les checkbox, on ajoute ou retire
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

  get questions(): FormArray {
    return this.qcmForm.get('questions') as FormArray;
  }

  getResponses(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('responses') as FormArray;
  }

  // ---------- Sauvegarde ----------
  openSuccessModal(message: string) {
    this.successMessage = message;
    this.showSuccessModal = true;
    const modalEl = document.getElementById('successModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  openFailedModal(message: string) {
    this.failedMessage = message;
    this.showFailedModal = true;
    const modalEl = document.getElementById('failedModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
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

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredQcms = [...this.qcms];
    } else {
      this.filteredQcms = this.qcms.filter((qcm) =>
        (qcm.title + qcm.description + qcm.user).toLowerCase().includes(term)
      );
    }

    this.currentPage = 1; // ✅ Réinitialise pagination après recherche
  }

  // ---------- Pagination ----------
  get paginatedQCM() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredQcms.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.qcms.length) this.currentPage++;
  }
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
