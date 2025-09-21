import { Component } from '@angular/core';
import {
  AttemptQuestion,
  QuizAttemptsService,
} from '../../../services/quiz_attempts.service';
import { AuthService, AuthUser } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../pipes/format-Time.pipe';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-affichage-results',
  imports: [CommonModule, TimeFormatPipe],
  templateUrl: './affichage-results.component.html',
})
export class AffichageResultsComponent {
  attempts: any[] = [];
  currentUser: AuthUser | null = null;
  selectedAttemptQuestions: AttemptQuestion[] = [];

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
          },
          (err) => {
            console.error('Erreur récupération tentatives', err);
          }
        );
    }
  }

  getDurationMinutes(start: string | Date, end: string | Date): string {
    if (!start || !end) return '-';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const minutes = (endTime - startTime) / 60000;
    return minutes.toFixed(0); // arrondi à l'entier
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
}
