import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { QcmService } from '../../../services/qcm.service';
import { QuestionService } from '../../../services/question.service';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS

@Component({
  selector: 'app-ajout-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajout-question.component.html',
})
export class AjoutQuestionComponent implements OnInit {
  qcms: any[] = [];
  selectedQcmId: number | null = null;
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
  }

  loadQcms() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => (this.qcms = data),
      error: (err) => console.error('Erreur chargement QCMs', err),
    });
  }

  initForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      responses: this.fb.array([]),
    });

    // Ajouter 2 réponses par défaut
    this.addResponse();
    this.addResponse();
  }

  get responses(): FormArray {
    return this.questionForm.get('responses') as FormArray;
  }

  createResponse(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false],
    });
  }

  addResponse(): void {
    if (this.responses.length < this.maxResponses) {
      this.responses.push(this.createResponse());
    }
  }

  removeResponse(index: number): void {
    if (this.responses.length > this.minResponses) {
      this.responses.removeAt(index);
    }
  }

  onQcmChange(event: any) {
    this.selectedQcmId = +event.target.value;
  }

  submitForm() {
    if (!this.selectedQcmId) {
      alert('Veuillez sélectionner un QCM');
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

    const dataToSave: {
      id_qcm: number;
      question: string;
      type: 'single' | 'multiple';
      responses: any[];
    } = {
      id_qcm: this.selectedQcmId,
      question: formValue.question,
      type: 'single', // littéral compatible
      responses: validResponses,
    };

    this.questionService.createQuestion(dataToSave).subscribe({
      next: (res) => {
        // Afficher le modal Bootstrap
        const modalEl = document.getElementById('successModal');
        const modal = new bootstrap.Modal(modalEl!);
        modal.show();
        this.questionForm.reset();
        while (this.responses.length) this.responses.removeAt(0);
        this.addResponse();
        this.addResponse();
      },
      error: (err) => {
        console.error(err);
        alert("❌ Erreur lors de l'ajout de la question");
      },
    });
  }
}
