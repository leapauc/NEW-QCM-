import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { QuizAttemptsService } from '../../../services/quiz_attempts.service';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../pipes/format-Time.pipe';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, TimeFormatPipe, PaginationComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {
  pageSize = 5;

  nbStagiaires = 0;
  nbQuestionnaires = 0;
  nbQuestionnairesComplets = 0;
  nbQuestionnairesRealises = 0;
  questionnairePopulaire = '';
  stagiaireActif = { name: '', firstname: '' };

  // Tableaux
  allAttempts: any[] = [];
  paginatedAttempts: any[] = [];

  combinedUserStats: any[] = [];
  paginatedUserStats: any[] = [];

  userAvgTime: any[] = [];
  paginatedAvgTime: any[] = [];

  userRank: any[] = [];

  constructor(
    private statsService: StatsService,
    private quizAttemptsService: QuizAttemptsService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUserTables();
    this.loadAllAttempts();
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

    this.statsService.getRangeList().subscribe((res: any) => {
      this.userRank = res;
    });
  }

  loadAllAttempts() {
    this.quizAttemptsService.getAllAttempts().subscribe({
      next: (res: any[]) => {
        this.allAttempts = res;
        this.paginatedAttempts = this.allAttempts.slice(0, this.pageSize);
      },
      error: (err) => console.error('Erreur récupération des tentatives', err),
    });
  }

  loadUserTables() {
    // Tableau statistiques utilisateurs (min/max/avg)
    this.statsService.getMaxMinAvgScoreList().subscribe((statsRes: any[]) => {
      this.statsService.getNbQuestionnaireList().subscribe((nbRes: any[]) => {
        this.combinedUserStats = statsRes.map((user) => {
          const nb =
            nbRes.find((u) => u.id_user === user.id_user)?.nb_questionnaires ??
            0;
          return { ...user, nb_questionnaires: nb };
        });
        this.paginatedUserStats = this.combinedUserStats.slice(
          0,
          this.pageSize
        );
      });
    });

    // Tableau temps moyen
    this.statsService.getAvgTimeList().subscribe((res: any[]) => {
      this.userAvgTime = res;
      this.paginatedAvgTime = this.userAvgTime.slice(0, this.pageSize);
    });
  }

  getCompletionColor(percent: number): string {
    if (percent < 25) return 'red';
    if (percent < 50) return 'lightcoral';
    if (percent < 75) return 'orange';
    if (percent < 100) return 'yellow';
    return 'lightgreen';
  }
}
