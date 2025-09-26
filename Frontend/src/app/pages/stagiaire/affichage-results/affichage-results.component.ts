import { Component } from '@angular/core';
import { QuizAttemptsService } from '../../../services/quiz_attempts.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { AuthUser } from '../../../models/authUser';
import { AttemptQuestion } from '../../../models/attemptQuestion';

@Component({
  selector: 'app-affichage-results',
  imports: [CommonModule, FormsModule],
  templateUrl: './affichage-results.component.html',
})
export class AffichageResultsComponent {
  attempts: any[] = [];
  currentUser: AuthUser | null = null;
  selectedAttemptQuestions: AttemptQuestion[] = [];
  currentPage = 1;
  pageSize = 10;
  filteredAttempts: any[] = [];
  searchTerm = '';

  constructor(
    private quizAttemptsService: QuizAttemptsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    if (this.currentUser) {
      this.quizAttemptsService
        .getAttemptsByUser(this.currentUser.id_user)
        .subscribe(
          (res) => {
            this.attempts = res;
            this.filteredAttempts = [...this.attempts];
          },
          (err) => {
            console.error('Erreur récupération tentatives', err);
          }
        );
    }
  }
  getCompletedRounded(attempt: any): number {
    return Math.round(attempt.completed);
  }

  viewAttempt(id_attempt: number) {
    this.quizAttemptsService.getAttemptDetails(id_attempt).subscribe((res) => {
      this.selectedAttemptQuestions = res.questions;
      const modalEl = document.getElementById('attemptModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  }

  closeModal() {
    const modalEl = document.getElementById('attemptModal');
    if (modalEl) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  }

  getCompletionColor(percent: number): string {
    if (percent < 25) return 'red';
    if (percent < 50) return 'lightcoral';
    if (percent < 75) return 'orange';
    if (percent < 100) return 'yellow';
    return 'lightgreen';
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredAttempts = [...this.attempts];
    } else {
      this.filteredAttempts = this.attempts.filter((a) =>
        (a.title + a.score + a.progression).toLowerCase().includes(term)
      );
    }

    this.currentPage = 1; // ✅ Réinitialise pagination après recherche
  }

  get paginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAttempts.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.attempts.length)
      this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
