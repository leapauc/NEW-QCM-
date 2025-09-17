import { Component } from '@angular/core';
import { StatsService } from '../../../services/stats.service';

@Component({
  selector: 'app-dashboard-admin',
  imports: [],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
})
export class DashboardAdminComponent {
  nbStagiaires = 0;
  nbQuestionnaires = 0;
  nbQuestionnairesComplets = 0;
  nbQuestionnairesRealises = 0;
  questionnairePopulaire = '';
  stagiaireActif = { name: '', firstname: '' };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
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
  }
}
