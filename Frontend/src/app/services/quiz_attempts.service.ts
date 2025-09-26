// src/app/services/stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttemptQuestion } from '../models/attemptQuestion';
import { AttemptPayload } from '../models/attemptPayload';

@Injectable({
  providedIn: 'root',
})
export class QuizAttemptsService {
  private apiUrl = 'http://localhost:3000/quizAttempts'; // Adapter selon ton API

  constructor(private http: HttpClient) {}

  // Récupérer les tentatives d'un utilisateur
  getAttemptsByUser(id_user: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id_user}`);
  }

  // Récupérer toutes les tentatives
  getAllAttempts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Détails d'une tentative précise
  getAttemptDetails(
    id_attempt: number
  ): Observable<{ questions: AttemptQuestion[] }> {
    return this.http.get<{ questions: AttemptQuestion[] }>(
      `${this.apiUrl}/attempt_details/${id_attempt}`
    );
  }

  // ✅ Nouvelle méthode saveAttempt (plus propre)
  saveAttempt(payload: AttemptPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
