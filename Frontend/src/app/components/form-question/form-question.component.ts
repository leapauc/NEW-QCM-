import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { QcmService } from '../../services/qcm.service';

@Component({
  selector: 'app-form-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Ajout des modules nécessaires
  templateUrl: './form-question.component.html',
  styleUrl: './form-question.component.css',
})
export class FormQuestionComponent {
  @Input() questionId: number | null = null;
  questionForm!: FormGroup;
  maxResponses = 5;
  minResponses = 2;

  constructor(private fb: FormBuilder, private qcmService: QcmService) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      responses: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      responses: this.fb.array([]),
    });

    // Ajoute les 2 premières réponses par défaut
    this.addResponse();
    this.addResponse();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['questionId'] && this.questionId !== null) {
      // charger les détails de la question depuis ton service
      console.log('Nouvelle question sélectionnée :', this.questionId);
    }
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

  submitForm(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const formValue = this.questionForm.value;
    const validResponses = formValue.responses.filter(
      (r: any) => r.text.trim() !== ''
    );

    if (validResponses.length < this.minResponses) {
      alert('Il faut au moins deux réponses non vides.');
      return;
    }

    const dataToSave = {
      title: formValue.title,
      description: formValue.description,
      responses: validResponses,
    };

    console.log('✅ Données prêtes à être envoyées :', dataToSave);
  }
}
