import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionResponse } from '../models/questionResponse';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:3000/questions';

  constructor(private http: HttpClient) {}
  /** 🔹 Récupérer toutes les questions (tous les QCM confondus) */
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/`);
  }

  // 🔎 Récupérer une question par son ID
  getQuestionById(id_question: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id_question}`);
  }

  // 🔎 Récupérer une question et ses réponses par son ID
  getQuestionReponseById(id_question: number): Observable<QuestionResponse[]> {
    return this.http.get<QuestionResponse[]>(
      `${this.apiUrl}/response/${id_question}`
    );
  }

  // ➕ Créer une question
  createQuestion(question: Question): Observable<any> {
    return this.http.post(`${this.apiUrl}`, question);
  }

  // ✏️ Mettre à jour une question
  updateQuestion(id_question: number, question: Question): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id_question}`, question);
  }

  // 🗑️ Supprimer une question
  deleteQuestion(id_question: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_question}`);
  }
}
