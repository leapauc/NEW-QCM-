// src/app/services/stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  nbStagiaires: number;
  nbQuestionnaires: number;
  nbQuestionnairesComplets: number;
  nbQuestionnairesRealises: number;
  questionnairePopulaire: string;
  stagiaireActif: { name: string; firstname: string };
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private apiUrl = 'http://localhost:3000/stats'; // adapter si nécessaire

  constructor(private http: HttpClient) {}

  getNbStagiaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbStagiaire`);
  }

  getNbQuestionnaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbQuestionnaire`);
  }

  getNbCompletQuestionnaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbCompletQuestionnaire`);
  }

  getNbQuestionRealise(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nbRealisedQuestionnaire`);
  }

  getQuestionnairePopulaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questionnairePopulaire`);
  }

  getFirstStagiaireActif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/firstActivStagiaire`);
  }
}
