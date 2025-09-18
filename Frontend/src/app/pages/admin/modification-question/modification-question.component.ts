import { Component, OnInit } from '@angular/core';
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
import {
  QuestionResponse,
  QuestionService,
} from '../../../services/question.service';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS

@Component({
  selector: 'app-modification-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modification-question.component.html',
})
export class ModificationQuestionComponent implements OnInit {
  qcms: any[] = [];
  questions: any[] = [];
  selectedQcmId: number | null = null;
  selectedQuestionId: number | null = null;

  questionForm!: FormGroup;
  maxResponses = 5;
  minResponses = 2;

  constructor(
    private fb: FormBuilder,
    private qcmService: QcmService,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.loadQcms();
    this.initForm();
    this.addResponse();
    this.addResponse();
  }

  // -------- Form Initialization --------
  initForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      responses: this.fb.array([]),
    });
  }

  get responses(): FormArray {
    return this.questionForm.get('responses') as FormArray;
  }

  createResponse(text = '', isCorrect = false): FormGroup {
    return this.fb.group({
      text: [text, Validators.required],
      isCorrect: [isCorrect],
    });
  }

  addResponse(text = '', isCorrect = false) {
    if (this.responses.length < this.maxResponses) {
      this.responses.push(this.createResponse(text, isCorrect));
    }
  }

  removeResponse(index: number) {
    if (this.responses.length > this.minResponses) {
      this.responses.removeAt(index);
    }
  }

  // -------- Load QCMs and Questions --------
  loadQcms() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => (this.qcms = data),
      error: (err) => console.error('Erreur chargement QCMs', err),
    });
  }

  onQcmChange(event: any) {
    this.selectedQcmId = +event.target.value;

    // Réinitialiser la sélection de la question
    this.selectedQuestionId = null;

    // Vider le formulaire
    this.questionForm.reset();
    while (this.responses.length) {
      this.responses.removeAt(0);
    }

    // Charger les questions du nouveau QCM
    if (this.selectedQcmId) {
      this.loadQuestionsByQcm(this.selectedQcmId);
    }
  }

  loadQuestionsByQcm(qcmId: number) {
    this.qcmService.getQcmQuestions(qcmId).subscribe({
      next: (data) => (this.questions = data),
      error: (err) => {
        console.error('Erreur chargement questions', err);
        this.questions = [];
      },
    });
  }

  onQuestionChange(event: any) {
    this.selectedQuestionId = +event.target.value;
    if (this.selectedQuestionId)
      this.loadQuestionDetails(this.selectedQuestionId);
  }

  loadQuestionDetails(questionId: number) {
    this.questionService.getQuestionReponseById(questionId).subscribe({
      next: (data: QuestionResponse[]) => {
        // ✅ correspond maintenant au type Observable<>
        if (!data || data.length === 0) return;

        const first = data[0];

        this.questionForm.patchValue({
          question: first.question,
        });

        // Clear old responses
        while (this.responses.length) this.responses.removeAt(0);

        // Add responses from backend
        data.forEach((r: QuestionResponse) => {
          this.addResponse(r.response, r.is_correct);
        });
      },
      error: (err) => console.error('Erreur chargement détails question', err),
    });
  }

  resetForm() {
    if (!this.selectedQuestionId) return;

    // Recharger les valeurs originales depuis le service
    this.questionService
      .getQuestionReponseById(this.selectedQuestionId)
      .subscribe({
        next: (data: QuestionResponse[]) => {
          if (!data || data.length === 0) return;

          const first = data[0];

          // Remettre le titre
          this.questionForm.patchValue({ question: first.question });

          // Vider les réponses existantes
          while (this.responses.length) this.responses.removeAt(0);

          // Remettre les réponses originales
          data.forEach((r) => this.addResponse(r.response, r.is_correct));
        },
        error: (err) => console.error('Erreur réinitialisation question', err),
      });
  }

  // -------- Submit Form --------
  submitForm() {
    if (!this.selectedQcmId || !this.selectedQuestionId) {
      alert('Veuillez sélectionner un QCM et une question');
      return;
    }

    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const formValue = this.questionForm.value;
    const validResponses = formValue.responses
      .filter((r: any) => r.text.trim() !== '')
      .map((r: any, index: number) => ({
        response: r.text,
        is_correct: r.isCorrect,
        position: index + 1,
      }));

    if (validResponses.length < this.minResponses) {
      alert(`Il faut au moins ${this.minResponses} réponses non vides.`);
      return;
    }

    type QuestionType = 'single' | 'multiple';

    const correctCount = validResponses.filter(
      (r: { is_correct: boolean }) => r.is_correct
    ).length;
    const questionType: QuestionType = correctCount > 1 ? 'multiple' : 'single';

    const dataToUpdate: {
      question: string;
      type: QuestionType;
      responses: any[];
    } = {
      question: formValue.question,
      type: questionType,
      responses: validResponses,
    };

    this.questionService
      .updateQuestion(this.selectedQuestionId, dataToUpdate)
      .subscribe({
        next: (res) => {
          // Afficher le modal Bootstrap
          const modalEl = document.getElementById('successModal');
          const modal = new bootstrap.Modal(modalEl!);
          modal.show();
        },
        error: (err) => {
          console.error(err);
          // Afficher le modal Bootstrap
          const modalEl = document.getElementById('failedModal');
          const modal = new bootstrap.Modal(modalEl!);
          modal.show();
        },
      });
  }
}
