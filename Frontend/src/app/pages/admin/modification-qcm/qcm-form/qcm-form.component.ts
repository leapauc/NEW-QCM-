// qcm-form.component.ts
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  QCM,
  QcmService,
  Question,
  ResponseOption,
} from '../../../../services/qcm.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qcm-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './qcm-form.component.html',
})
export class QcmFormComponent implements OnChanges {
  @Input() qcm!: QCM;
  @Output() qcmUpdated = new EventEmitter<void>();

  qcmForm!: FormGroup;

  constructor(private fb: FormBuilder, private qcmService: QcmService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['qcm'] && this.qcm) {
      this.buildForm();
    }
  }

  buildForm() {
    this.qcmForm = this.fb.group({
      title: [this.qcm.title, Validators.required],
      description: [this.qcm.description],
      questions: this.fb.array(
        this.qcm.questions!.map((q) => this.buildQuestion(q))
      ),
    });
  }

  buildQuestion(q: Question): FormGroup {
    return this.fb.group({
      id_question: [q.id_question],
      question: [q.question, Validators.required],
      type: [q.type],
      responses: this.fb.array(q.responses.map((r) => this.buildResponse(r))),
    });
  }

  buildResponse(r: ResponseOption): FormGroup {
    return this.fb.group({
      id_response: [r.id_response],
      response: [r.response, Validators.required],
      is_correct: [r.is_correct],
      position: [r.position],
    });
  }

  getResponses(q: FormGroup): FormArray<FormGroup> {
    return q.get('responses') as FormArray<FormGroup>;
  }

  get questions(): FormArray<FormGroup> {
    return this.qcmForm.get('questions') as FormArray<FormGroup>;
  }

  save() {
    if (this.qcmForm.invalid) return;

    const updatedQcm: QCM = {
      ...this.qcm,
      ...this.qcmForm.value,
    };

    this.qcmService.updateQCM(this.qcm.id_qcm!, updatedQcm).subscribe({
      next: () => {
        alert('QCM mis à jour avec succès !');
        this.qcmUpdated.emit();
      },
      error: (err) => console.error('Erreur update', err),
    });
  }
}
