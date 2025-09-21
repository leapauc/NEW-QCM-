import { Component, OnInit } from '@angular/core';
import { QCM, QcmService } from '../../../services/qcm.service';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../../../services/auth.service';
import { QuizAttemptsService } from '../../../services/quiz_attempts.service';

@Component({
  selector: 'app-choix-qcm',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './choix-qcm.component.html',
})
export class ChoixQcmComponent implements OnInit {
  qcms: QCM[] = [];
  selectedQcm: QCM | null = null;
  attemptForm!: FormGroup;
  currentPage = 1;
  pageSize = 5;

  constructor(
    private qcmService: QcmService,
    private fb: FormBuilder,
    private authService: AuthService,
    private quizAttemptsService: QuizAttemptsService
  ) {}

  ngOnInit(): void {
    this.loadQCMs();
  }

  // Pagination
  get paginatedQCM() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.qcms.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.qcms.length) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  // Accès au FormArray questions
  get questions(): FormArray {
    return this.attemptForm.get('questions') as FormArray;
  }
  // Méthode pour accéder au FormArray responses d’une question
  getResponses(qIndex: number): FormArray {
    return this.questions.at(qIndex).get('responses') as FormArray;
  }

  // Charger tous les QCM
  loadQCMs() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => (this.qcms = data),
      error: (err) => console.error('Erreur chargement QCM', err),
    });
  }

  // Charger questions + réponses d’un QCM et ouvrir modal
  editQCM(qcm: QCM) {
    this.qcmService.getQcmQuestionsWithResponses(qcm.id_qcm!).subscribe({
      next: (questions) => {
        // Le backend renvoie un tableau de questions avec leurs réponses dans "responses"
        this.selectedQcm = { ...qcm, questions };
        this.initForm();

        const modalEl = document.getElementById('qcmModal');
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      },
      error: (err) => console.error('Erreur chargement questions', err),
    });
  }

  // Initialiser le formulaire réactif avec questions et réponses
  initForm() {
    this.attemptForm = this.fb.group({
      title: [this.selectedQcm?.title, Validators.required],
      description: [this.selectedQcm?.description],
      questions: this.fb.array([]),
    });

    this.selectedQcm?.questions?.forEach((q) => {
      const questionGroup = this.fb.group({
        id_question: [q.id_question],
        question: [q.question, Validators.required],
        type: [q.type || 'single'], // Par défaut 'single' si non défini
        responses: this.fb.array([]),
      });

      // Le backend renvoie les réponses dans q.responses
      q.responses.forEach((resp: any) => {
        (questionGroup.get('responses') as FormArray).push(
          this.fb.group({
            id_response: [resp.id_response],
            response: [resp.response],
            selected: [false], // initialement non sélectionné
            is_correct: [resp.is_correct],
          })
        );
      });

      (this.attemptForm.get('questions') as FormArray).push(questionGroup);
    });
  }

  // Réinitialiser le formulaire (désélectionner toutes les réponses)
  resetForm() {
    if (this.selectedQcm) this.initForm();
  }

  // Soumettre les réponses sélectionnées
  submitForm() {
    if (!this.selectedQcm) return;
    const user = this.authService.getUser();
    if (!user) return;

    const answers: { id_question: number; id_response: number }[] = [];

    this.questions.controls.forEach((qCtrl) => {
      const responses = qCtrl.get('responses') as FormArray;
      responses.controls.forEach((rCtrl) => {
        if (rCtrl.value.selected) {
          answers.push({
            id_question: qCtrl.value.id_question,
            id_response: rCtrl.value.id_response,
          });
        }
      });
    });

    if (answers.length === 0) {
      alert('Veuillez sélectionner au moins une réponse.');
      return;
    }

    this.quizAttemptsService
      .submitAttempt(user.id_user, this.selectedQcm.id_qcm!, answers)
      .subscribe({
        next: (res) => {
          alert(`Score: ${res.score}, Progression: ${res.completed}%`);
          const modalEl = document.getElementById('qcmModal');
          bootstrap.Modal.getInstance(modalEl!)?.hide();
        },
        error: (err) => console.error('Erreur submission tentative', err),
      });
  }
}
