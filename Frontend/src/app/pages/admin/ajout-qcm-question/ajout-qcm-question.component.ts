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
import * as bootstrap from 'bootstrap';
import { ModalComponent } from '../../../components/modal_success_failure/modal.component';

@Component({
  selector: 'app-ajout-qcm-question',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalComponent],
  templateUrl: './ajout-qcm-question.component.html',
})
export class AjoutQcmQuestionComponent implements OnInit {
  qcmForm!: FormGroup;
  maxResponses = 5;
  minResponses = 2;

  constructor(private fb: FormBuilder, private qcmService: QcmService) {}

  ngOnInit(): void {
    this.initForm();
  }

  // Initialisation formulaire
  initForm() {
    this.qcmForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      questions: this.fb.array([]),
    });
  }

  // Récupérer FormArray questions
  get questions(): FormArray {
    return this.qcmForm.get('questions') as FormArray;
  }

  // Récupérer FormArray réponses d’une question
  getResponses(qIndex: number): FormArray {
    return this.questions.at(qIndex).get('responses') as FormArray;
  }

  // Ajouter une question
  addQuestion() {
    const questionGroup = this.fb.group({
      question: ['', Validators.required],
      type: ['single'], // simple ou multiple
      responses: this.fb.array([]),
    });

    // Ajouter 2 réponses par défaut
    for (let i = 0; i < this.minResponses; i++) {
      (questionGroup.get('responses') as FormArray).push(
        this.fb.group({
          response: ['', Validators.required],
          is_correct: [false],
          position: [i + 1],
        })
      );
    }

    this.questions.push(questionGroup);
  }

  // Ajouter une réponse
  addResponse(qIndex: number) {
    const responses = this.getResponses(qIndex);
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

  // Supprimer une réponse
  removeResponse(qIndex: number, rIndex: number) {
    const responses = this.getResponses(qIndex);
    if (responses.length > this.minResponses) responses.removeAt(rIndex);
  }

  // Supprimer une question
  removeQuestion(qIndex: number) {
    this.questions.removeAt(qIndex);
  }

  // Soumettre le formulaire
  submitForm() {
    if (this.qcmForm.invalid) {
      this.qcmForm.markAllAsTouched();
      return;
    }

    // Vérifier qu’au moins une réponse correcte par question
    for (const q of this.qcmForm.value.questions) {
      if (!q.responses.some((r: any) => r.is_correct)) {
        const modalEl = document.getElementById('unvalidModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
        return;
      }
    }

    this.qcmService.createQCM(this.qcmForm.value).subscribe({
      next: () => {
        const modalEl = document.getElementById('successModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
        this.qcmForm.reset();
        this.questions.clear();
      },
      error: () => {
        const modalEl = document.getElementById('failedModal');
        if (modalEl) new bootstrap.Modal(modalEl).show();
      },
    });
  }
}
