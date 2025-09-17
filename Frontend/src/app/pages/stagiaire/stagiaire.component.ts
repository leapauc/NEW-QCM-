import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-stagiaire',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './stagiaire.component.html',
  styleUrl: './stagiaire.component.css',
})
export class StagiaireComponent {
  constructor(private authService: AuthService, private router: Router) {}
  logout() {
    this.authService.logout(); // supprime le token ou l'état de connexion
    this.router.navigate(['/login']); // redirige vers la page de login
  }
}
