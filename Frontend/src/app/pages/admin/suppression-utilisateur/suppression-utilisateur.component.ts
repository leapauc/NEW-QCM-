import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { UserService } from '../../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user';
import { SearchBarComponent } from '../../../components/search_bar/search_bar.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ConfirmationModalComponent } from '../../../components/confirmation_modal/confirmation_modal.component';
import { AuthService } from '../../../services/auth.service';
import { TruncateEmailPipe } from '../../../pipes/truncate-email.pipe';

/**
 * Composant responsable de la suppression des utilisateurs.
 *
 * @description
 * Ce composant permet :
 * - de charger et afficher la liste des utilisateurs disponibles
 * - de filtrer les utilisateurs via une barre de recherche
 * - de sélectionner un utilisateur et afficher une modale de confirmation
 * - de supprimer l'utilisateur sélectionné via le service UserService
 *
 * @usageNotes
 * ### Importation
 * Ce composant importe et utilise :
 * - `CommonModule`, `FormsModule`
 * - `SearchBarComponent` pour la recherche
 * - `PaginationComponent` pour la pagination
 * - `ConfirmationModalComponent` pour afficher le dialogue de confirmation avant suppression
 *
 * @example
 * ```html
 * <app-suppression-utilisateur></app-suppression-utilisateur>
 * ```
 *
 * @selector app-suppression-utilisateur
 * @component
 */
@Component({
  selector: 'app-suppression-utilisateur',
  imports: [
    CommonModule,
    FormsModule,
    SearchBarComponent,
    PaginationComponent,
    ConfirmationModalComponent,
    TruncateEmailPipe,
  ],
  templateUrl: './suppression-utilisateur.component.html',
})
export class SuppressionUtilisateurComponent implements OnInit {
  /**
   * Liste complète des utilisateurs récupérés depuis l'API.
   */
  users: User[] = [];
  /**
   * Utilisateur actuellement sélectionné pour suppression.
   */
  selectedUser: User | null = null;
  /**
   * Formulaire réactif affichant les informations de l'utilisateur sélectionné.
   */
  form: FormGroup;
  /**
   * Liste filtrée des utilisateurs selon le terme de recherche.
   */
  filteredUsers: User[] = [];
  /**
   * Terme de recherche saisi par l'utilisateur.
   */
  searchTerm = '';
  /**
   * Liste paginée des utilisateurs affichés dans le tableau.
   */
  paginatedUsers: User[] = [];
  /**
   * Message de retour affiché après suppression (succès ou erreur).
   */
  message: string | null = null;
  /**
   * Classe CSS appliquée au message (ex. "alert-success", "alert-danger").
   */
  messageClass: string = '';
  /** Stocke l'id de l'utilisateur courant*/
  private currentUserId: number | null = null;
  /** Etat chargement des données */
  isLoading = true;
  SmallScreenSize = 787;
  isSmallScreen = window.innerWidth < this.SmallScreenSize;

  /**
   * Constructeur du composant.
   * @param userService Service pour récupérer et supprimer les utilisateurs.
   * @param fb FormBuilder pour créer et gérer le formulaire.
   * @param cdr ChangeDetectorRef pour forcer la détection des changements après mises à jour asynchrones.
   * @param authService AuthService pour pouvoir récupérer les informations de d'administrateur connecté.
   */
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      society: ['', Validators.required],
      password: [''],
      admin: [false],
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = event.target.innerWidth < this.SmallScreenSize;
  }

  /**
   * Cycle de vie Angular : Initialisation du composant.
   * Charge les utilisateurs dès l'affichage.
   */
  ngOnInit() {
    const currentUser = this.authService.getUser();
    this.currentUserId = currentUser ? currentUser.id_user : null;

    this.loadUsers();
    this.isSmallScreen = window.innerWidth < this.SmallScreenSize;
  }

  /**
   * Charge tous les utilisateurs depuis le service et initialise la pagination,
   * en excluant l’administrateur connecté.
   */
  loadUsers() {
    this.isLoading = true;

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = this.currentUserId
          ? data.filter((u) => u.id_user !== this.currentUserId)
          : data;

        this.filteredUsers = [...this.users];
        this.paginatedUsers = this.filteredUsers.slice(0, 5);

        this.isLoading = false; // ✅ fin du chargement
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement des utilisateurs :', err);
        this.isLoading = false;
      },
    });
  }

  /**
   * Ouvre la modale de confirmation avant suppression.
   */
  openConfirmModal() {
    const modalEl = document.getElementById('confirmationModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  /**
   * Sélectionne un utilisateur et préremplit le formulaire, puis ouvre la modale de confirmation.
   * @param user Utilisateur à supprimer.
   */
  selectUser(user: User) {
    this.selectedUser = user;
    this.form.patchValue({
      name: user.name,
      firstname: user.firstname,
      email: user.email,
      society: user.society,
      password: '', // ne pas pré-remplir le mot de passe
      admin: user.admin || false,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    this.openConfirmModal();
  }

  /**
   * Sélectionne un utilisateur et préremplit le formulaire, puis ouvre la modale de confirmation.
   * @param user Utilisateur à supprimer.
   */
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter((u) =>
        (u.name + u.firstname + u.email + u.society)
          .toLowerCase()
          .includes(term)
      );
    }

    Promise.resolve().then(() => {
      this.paginatedUsers = this.filteredUsers.slice(0, 5);
      this.cdr.detectChanges();
    });
  }

  // Supprimer l'utilisateur sélectionné
  /**
   * Supprime l'utilisateur sélectionné via le service.
   * Affiche un message de succès ou d'erreur et recharge la liste des utilisateurs.
   */
  deleteUser(): void {
    if (!this.selectedUser || this.selectedUser.id_user == null) return;

    this.userService.deleteUser(this.selectedUser.id_user).subscribe({
      next: () => {
        this.message = `Utilisateur "${this.selectedUser?.name}" supprimé avec succès !`;
        this.messageClass = 'alert alert-success'; // vert
        this.loadUsers();
        this.selectedUser = null;

        const modalEl = document.getElementById('confirmationModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

        // faire disparaître le message après 2 secondes
        setTimeout(() => (this.message = null), 2000);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
        this.message = 'Impossible de supprimer cet utilisateur.';
        this.messageClass = 'alert alert-danger'; // rouge
        setTimeout(() => (this.message = null), 2000);
      },
    });
  }
}
