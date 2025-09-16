import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  showQcm = false;
  showQuestions = false;
  showStagiaires = false;

  constructor(private authService: AuthService, private router: Router) {}
  toggleQcm() {
    this.showQcm = !this.showQcm;
  }

  toggleQuestions() {
    this.showQuestions = !this.showQuestions;
  }

  toggleStagiaires() {
    this.showStagiaires = !this.showStagiaires;
  }

  logout() {
    this.authService.logout(); // supprime le token ou l'état de connexion
    this.router.navigate(['/login']); // redirige vers la page de login
  }
}
