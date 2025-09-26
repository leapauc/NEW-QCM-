import { Component } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { CommonModule } from '@angular/common';
import { QuizAttemptsService } from '../../../services/quiz_attempts.service';
import { TimeFormatPipe } from '../../../pipes/format-Time.pipe';

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, TimeFormatPipe],
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent {
  nbStagiaires = 0;
  nbQuestionnaires = 0;
  nbQuestionnairesComplets = 0;
  nbQuestionnairesRealises = 0;
  questionnairePopulaire = '';
  stagiaireActif = { name: '', firstname: '' };
  currentPage = 1;
  pageSize = 5;

  // Nouvelles variables pour les tableaux
  userStats: any[] = [];
  userAvgTime: any[] = [];
  userRank: any[] = [];
  userNbQuestionnaire: any[] = [];
  allAttempts: any[] = []; // <-- nouveau
  combinedUserStats: any[] = [];

  constructor(
    private statsService: StatsService,
    private quizAttemptsService: QuizAttemptsService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUserTables();
    this.loadAllAttempts();
  }

  loadAllAttempts() {
    this.quizAttemptsService.getAllAttempts().subscribe({
      next: (res: any[]) => {
        this.allAttempts = res;
      },
      error: (err) => console.error('Erreur récupération des tentatives', err),
    });
  }

  loadStats() {
    this.statsService.getNbStagiaire().subscribe((res: any) => {
      this.nbStagiaires = parseInt(res[0].count, 10);
    });

    this.statsService.getNbQuestionnaire().subscribe((res: any) => {
      this.nbQuestionnaires = parseInt(res[0].count, 10);
    });

    this.statsService.getNbCompletQuestionnaire().subscribe((res: any) => {
      this.nbQuestionnairesComplets = parseInt(res[0].count, 10);
    });

    this.statsService.getNbQuestionRealise().subscribe((res: any) => {
      this.nbQuestionnairesRealises = parseInt(res[0].count, 10);
    });

    this.statsService.getQuestionnairePopulaire().subscribe((res: any) => {
      if (res.length > 0) this.questionnairePopulaire = res[0].title;
    });

    this.statsService.getFirstStagiaireActif().subscribe((res: any) => {
      if (res.length > 0) this.stagiaireActif = res[0];
    });

    this.statsService.getNbQuestionnaireList().subscribe((nbRes: any[]) => {
      this.statsService.getMaxMinAvgScoreList().subscribe((statsRes: any[]) => {
        // Fusionner les tableaux
        this.combinedUserStats = statsRes.map((user) => {
          const nb =
            nbRes.find((u) => u.id_user === user.id_user)?.nb_questionnaires ??
            0;
          return {
            ...user,
            nb_questionnaires: nb,
          };
        });
      });
    });
  }

  loadUserTables() {
    // Tableau questionnaires par utilisateur (min/max/avg)
    this.statsService.getNbQuestionnaireList().subscribe((res: any) => {
      this.userNbQuestionnaire = res;
    });
    this.statsService.getMaxMinAvgScoreList().subscribe((res: any) => {
      this.userStats = res;
    });

    // Tableau temps moyen
    this.statsService.getAvgTimeList().subscribe((res: any) => {
      this.userAvgTime = res;
    });

    // Tableau rang
    this.statsService.getRangeList().subscribe((res: any) => {
      this.userRank = res;
    });
  }

  get paginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allAttempts.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.allAttempts.length)
      this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  getCompletionColor(percent: number): string {
    if (percent < 25) return 'red';
    if (percent < 50) return 'lightcoral';
    if (percent < 75) return 'orange';
    if (percent < 100) return 'yellow';
    return 'lightgreen';
  }
}
