import { Component } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent {
  nbStagiaires = 0;
  nbQuestionnaires = 0;
  nbQuestionnairesComplets = 0;
  nbQuestionnairesRealises = 0;
  questionnairePopulaire = '';
  stagiaireActif = { name: '', firstname: '' };

  // Nouvelles variables pour les tableaux
  userStats: any[] = [];
  userAvgTime: any[] = [];
  userRank: any[] = [];
  userNbQuestionnaire: any[] = [];

  combinedUserStats: any[] = [];

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUserTables();
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
}
