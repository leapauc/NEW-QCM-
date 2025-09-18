import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QCM {
  id_qcm?: number;
  title: string;
  description?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  questions?: Question[];
}

export interface Question {
  id_question?: number;
  id_qcm?: number;
  question: string;
  type: 'single' | 'multiple';
  position?: number;
  responses: ResponseOption[];
}

export interface ResponseOption {
  id_response?: number;
  id_question?: number;
  response: string;
  is_correct: boolean;
  position?: number;
}

@Injectable({
  providedIn: 'root',
})
export class QcmService {
  private apiUrl = 'http://localhost:3000/qcm'; // adapte si ton backend a un autre port

  constructor(private http: HttpClient) {}

  /** 🔹 Récupérer tous les QCM */
  getAllQCM(): Observable<QCM[]> {
    return this.http.get<QCM[]>(`${this.apiUrl}`);
  }

  /** 🔹 Créer un nouveau QCM */
  createQCM(qcm: QCM): Observable<any> {
    return this.http.post(`${this.apiUrl}`, qcm);
  }

  /** 🔹 Mettre à jour un QCM existant */
  updateQCM(id: number, qcm: QCM): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, qcm);
  }

  /** 🔹 Supprimer un QCM */
  deleteQCM(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** 🔹 Récupérer les questions avec leurs réponses d’un QCM */
  getQcmQuestionsWithResponses(qcmId: number): Observable<Question[]> {
    return this.http.get<Question[]>(
      `${this.apiUrl}/QcmQuestionsResponses/${qcmId}`
    );
  }

  /** 🔹 Récupérer uniquement les questions (sans réponses) d’un QCM */
  getQcmQuestions(qcmId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/QcmQuestions/${qcmId}`);
  }
}
