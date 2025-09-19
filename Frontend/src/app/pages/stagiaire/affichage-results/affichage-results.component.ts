import { Component } from '@angular/core';
import {
  AttemptQuestion,
  QuizAttemptsService,
} from '../../../services/quiz_attempts.service';
import { AuthService, AuthUser } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../pipes/format-Time.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-affichage-results',
  imports: [CommonModule, TimeFormatPipe, ReactiveFormsModule],
  templateUrl: './affichage-results.component.html',
  styleUrl: './affichage-results.component.css',
})
export class AffichageResultsComponent {
  attempts: any[] = [];
  currentUser: AuthUser | null = null;
  selectedAttemptQuestions: AttemptQuestion[] = [];
  showAttemptModal = false;

  constructor(
    private quizAttemptsService: QuizAttemptsService,
    private authService: AuthService
  ) {}

  getDurationMinutes(start: string | Date, end: string | Date): string {
    if (!start || !end) return '-';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const minutes = (endTime - startTime) / 60000;
    return minutes.toString();
  }

  viewAttempt(id_attempt: number) {
    this.quizAttemptsService.getAttemptDetails(id_attempt).subscribe((res) => {
      this.selectedAttemptQuestions = res.questions;
      console.log(this.selectedAttemptQuestions);
      // ✅ Afficher le modal après avoir initialisé le formulaire
      const modalEl = document.getElementById('attemptModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  }

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
}
