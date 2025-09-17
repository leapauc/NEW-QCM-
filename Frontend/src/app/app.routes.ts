import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardAdminComponent } from './pages/admin/dashboard-admin/dashboard-admin.component';
import { DashboardStagiaireComponent } from './pages/stagiaire/dashboard-stagiaire/dashboard-stagiaire.component';
import { AjoutQcmComponent } from './pages/admin/ajout-qcm/ajout-qcm.component';
import { ModificationQcmComponent } from './pages/admin/modification-qcm/modification-qcm.component';
import { SuppressionQcmComponent } from './pages/admin/suppression-qcm/suppression-qcm.component';
import { AjoutStagiaireComponent } from './pages/admin/ajout-stagiaire/ajout-stagiaire.component';
import { ModificationStagiaireComponent } from './pages/admin/modification-stagiaire/modification-stagiaire.component';
import { SuppressionStagiaireComponent } from './pages/admin/suppression-stagiaire/suppression-stagiaire.component';
import { ChoixQcmComponent } from './pages/stagiaire/choix-qcm/choix-qcm.component';
import { AffichageResultsComponent } from './pages/stagiaire/affichage-results/affichage-results.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AjoutQuestionComponent } from './pages/admin/ajout-question/ajout-question.component';
import { ModificationQuestionComponent } from './pages/admin/modification-question/modification-question.component';
import { SuppressionQuestionComponent } from './pages/admin/suppression-question/suppression-question.component';
import { StagiaireComponent } from './pages/stagiaire/stagiaire.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'admin/dashboard', component: DashboardAdminComponent },
      { path: 'admin/ajout_qcm', component: AjoutQcmComponent },
      { path: 'admin/modification_qcm', component: ModificationQcmComponent },
      { path: 'admin/suppression_qcm', component: SuppressionQcmComponent },
      { path: 'admin/ajout_question', component: AjoutQuestionComponent },
      {
        path: 'admin/modification_question',
        component: ModificationQuestionComponent,
      },
      {
        path: 'admin/suppression_question',
        component: SuppressionQuestionComponent,
      },
      { path: 'admin/suppression_qcm', component: SuppressionQcmComponent },
      { path: 'admin/ajout_stagiaire', component: AjoutStagiaireComponent },
      {
        path: 'admin/modification_stagiaire',
        component: ModificationStagiaireComponent,
      },
      {
        path: 'admin/suppression_stagiaire',
        component: SuppressionStagiaireComponent,
      },
      { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'stagiaire',
    component: StagiaireComponent,
    children: [
      { path: 'stagiaire/dashboard', component: DashboardStagiaireComponent },
      { path: 'stagiaire/choix_qcm', component: ChoixQcmComponent },
      {
        path: 'stagiaire/affichage_results',
        component: AffichageResultsComponent,
      },
      { path: '', redirectTo: 'stagiaire/dashboard', pathMatch: 'full' },
    ],
  },
];
