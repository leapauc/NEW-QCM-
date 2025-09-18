import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../services/question.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { typeValidator } from '../../../validators/type.validator';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-suppression-question',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './suppression-question.component.html',
  styleUrl: './suppression-question.component.css',
})
export class SuppressionQuestionComponent implements OnInit {
  questions: any[] = [];
  selectedQuestion: any | null = null;
  form: FormGroup;
  currentPage = 1;
  pageSize = 5;

  message: string | null = null;
  messageClass: string = '';

  constructor(
    private questionService: QuestionService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      question: ['', Validators.required],
      type: ['', [Validators.required, typeValidator()]], // ✅ CORRECTION
      position: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getAllQuestions().subscribe({
      next: (data) => (this.questions = data),
      error: (err) => console.error('Erreur chargement questions : ', err),
    });
  }

  parseResponses(question: any): string[] {
    return question.response ? question.response.split('|') : [];
  }

  openConfirmModal() {
    const modalEl = document.getElementById('confirmModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  selectQuestion(question: any) {
    this.selectedQuestion = question;
    this.form.patchValue({
      question: question.question,
      type: question.type,
      position: question.position,
    });

    this.openConfirmModal(); // ✅ Ouvre bien la fenêtre de confirmation
  }

  deleteQuestion(): void {
    if (!this.selectedQuestion?.id_question) return;

    this.questionService
      .deleteQuestion(this.selectedQuestion.id_question)
      .subscribe({
        next: () => {
          this.message = `Question "${this.selectedQuestion?.question}" supprimée avec succès !`;
          this.messageClass = 'alert alert-success';
          this.loadQuestions();
          this.selectedQuestion = null;

          // Fermer le modal après suppression
          const modalEl = document.getElementById('confirmModal');
          if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

          setTimeout(() => (this.message = null), 2000);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.message = 'Impossible de supprimer cette question.';
          this.messageClass = 'alert alert-danger';
          setTimeout(() => (this.message = null), 2000);
        },
      });
  }

  get paginatedQuestions() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.questions.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.questions.length)
      this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
