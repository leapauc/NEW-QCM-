import { Component } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { AuthService, AuthUser } from '../../../services/auth.service';
import { TimeFormatPipe } from '../../../pipes/format-Time.pipe';

@Component({
  selector: 'app-dashboard-stagiaire',
  imports: [TimeFormatPipe],
  templateUrl: './dashboard-stagiaire.component.html',
  styleUrl: './dashboard-stagiaire.component.css',
})
export class DashboardStagiaireComponent {
  nbQuestionnairesRealises = 0;
  scoreMax = '-';
  scoreMin = '-';
  scoreAvg = '-';
  range = 'dernier';
  avgTime = '-';
  questionnairePopulaire = '';
  authNameUser = '';
  stagiaireActif = { name: '', firstname: '' };

  constructor(
    private statsService: StatsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    const currentUser: AuthUser | null = this.authService.getUser();
    if (!currentUser) return;

    this.authNameUser = currentUser.name;
    console.log(currentUser.name + ', ' + currentUser.id_user);
    // Nombre de questionnaires réalisés
    this.statsService
      .getNbQuestionnaireByUser(currentUser.id_user)
      .subscribe((res: any) => {
        this.nbQuestionnairesRealises = parseInt(
          res?.nb_questionnaires ?? 0,
          10
        );
      });

    // Scores min / max / avg
    this.statsService
      .getMaxMinAvgScoreByUser(currentUser.id_user)
      .subscribe((res: any) => {
        this.scoreMax = res?.max_score ?? '-';
        this.scoreMin = res?.min_score ?? '-';
        this.scoreAvg = res?.avg_score ?? '-';
      });

    // Rang
    this.statsService
      .getRangeByUser(currentUser.id_user)
      .subscribe((res: any) => {
        this.range = res?.rank ?? 'dernier';
      });

    // Temps moyen
    this.statsService
      .getAvgTimeByUser(currentUser.id_user)
      .subscribe((res: any) => {
        this.avgTime = res?.avg_time_minutes ?? '-';
      });

    // Questionnaire le plus populaire (pas besoin d'user)
    this.statsService.getQuestionnairePopulaire().subscribe((res: any) => {
      this.questionnairePopulaire = res?.[0]?.title ?? '';
    });
  }
}
