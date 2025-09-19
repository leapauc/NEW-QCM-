// src/app/services/stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttemptResponse {
  id_response: number;
  response: string;
  selected: boolean;
}

export interface AttemptQuestion {
  id_question: number;
  question: string;
  type: 'single' | 'multiple';
  responses: AttemptResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class QuizAttemptsService {
  private apiUrl = 'http://localhost:3000/quizAttempts'; // adapter si nécessaire

  constructor(private http: HttpClient) {}

  // Récupérer les tentatives d'un utilisateur
  getAttemptsByUser(id_user: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id_user}`);
  }

  // Récupérer toutes les tentatives
  getAllAttempts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getAttemptDetails(
    id_attempt: number
  ): Observable<{ questions: AttemptQuestion[] }> {
    return this.http.get<{ questions: AttemptQuestion[] }>(
      `${this.apiUrl}/attempt_details/${id_attempt}`
    );
  }
}
