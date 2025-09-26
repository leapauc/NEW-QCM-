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
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS
import { QCM } from '../../../models/qcm';

@Component({
  selector: 'app-modification-qcm-question',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modification-qcm-question.component.html',
})
export class ModificationQcmQuestionComponent implements OnInit {
  qcms: QCM[] = [];
  selectedQcm: QCM | null = null;
  qcmForm!: FormGroup;
  currentPage = 1;
  pageSize = 5;
  maxResponses = 5;
  minResponses = 2;

  constructor(private qcmService: QcmService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadQCMs();
  }

  // 🔹 Charger tous les QCM
  loadQCMs() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => (this.qcms = data),
      error: (err) => console.error('Erreur chargement QCM', err),
    });
  }

  // 🔹 Editer un QCM : récupérer les questions + réponses
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

  get questions(): FormArray {
    return this.qcmForm.get('questions') as FormArray;
  }

  getResponses(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('responses') as FormArray;
  }

  // Ajouter une réponse
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

  // Supprimer une réponse
  removeResponse(questionIndex: number, responseIndex: number) {
    const responses = this.getResponses(questionIndex);
    if (responses.length > this.minResponses) {
      responses.removeAt(responseIndex);
    }
  }

  // ---------- Sauvegarde ----------
  submitForm() {
    if (this.qcmForm.invalid || !this.selectedQcm) {
      this.qcmForm.markAllAsTouched();
      return;
    }

    const formValue = this.qcmForm.value;

    this.qcmService
      .updateQCM_Question(this.selectedQcm.id_qcm!, formValue)
      .subscribe({
        next: (res) => {
          const modalEl = document.getElementById('successModal');
          const modal = new bootstrap.Modal(modalEl!);
          modal.show();

          // Réinitialiser le formulaire et la sélection
          this.selectedQcm = null;
          this.qcmForm.reset();
          this.loadQCMs();
        },
        error: (err) => {
          const modalEl = document.getElementById('failedModal');
          const modal = new bootstrap.Modal(modalEl!);
          modal.show();
        },
      });
  }

  // ---------- Pagination ----------
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
}
