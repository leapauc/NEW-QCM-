import { Component, OnInit } from '@angular/core';
import { QCM, QcmService } from '../../../services/qcm.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-modification-qcm',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modification-qcm.component.html',
  styleUrls: ['./modification-qcm.component.css'],
})
export class ModificationQcmComponent implements OnInit {
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

  loadQCMs() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => (this.qcms = data),
      error: (err) => console.error('Erreur chargement QCM', err),
    });
  }

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

      // 🔹 Parser les réponses et is_correct séparées par "|"
      const responsesArray = (q.response || '').split('|');
      const isCorrectArray = (q.is_correct || '').split('|');

      responsesArray.forEach((resp: string, idx: number) => {
        (questionGroup.get('responses') as FormArray).push(
          this.fb.group({
            response: [resp, Validators.required],
            is_correct: [isCorrectArray[idx] === 'true'],
            position: [idx + 1],
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

  removeResponse(questionIndex: number, responseIndex: number) {
    const responses = this.getResponses(questionIndex);
    if (responses.length > this.minResponses) {
      responses.removeAt(responseIndex);
    }
  }

  // ---------- Sauvegarde ----------
  submitForm() {
    if (this.qcmForm.invalid) {
      this.qcmForm.markAllAsTouched();
      return;
    }
    const formValue = this.qcmForm.value;
    console.log('Données à envoyer:', formValue);
    // Ici tu appellerais ton service updateQCM pour envoyer formValue
  }

  onQcmUpdated() {
    this.selectedQcm = null;
    this.loadQCMs();
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
