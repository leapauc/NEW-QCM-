import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../services/question.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { typeValidator } from '../../../validators/type.validator';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-suppression-question',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './suppression-question.component.html',
})
export class SuppressionQuestionComponent implements OnInit {
  questions: any[] = [];
  selectedQuestion: any | null = null;
  form: FormGroup;
  currentPage = 1;
  pageSize = 5;
  filteredQuestions: any[] = [];
  searchTerm = '';

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
      next: (data) => {
        this.questions = data;
        this.filteredQuestions = [...this.questions];
      },
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

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredQuestions = [...this.questions];
    } else {
      this.filteredQuestions = this.questions.filter((question) =>
        (question.question + question.title).toLowerCase().includes(term)
      );
    }

    this.currentPage = 1;
  }

  get paginatedQuestions() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredQuestions.slice(start, start + this.pageSize); // ❌ Mauvais tableau
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.questions.length)
      this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
