import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user';
import { SearchBarComponent } from '../../../components/search_bar/search_bar.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ConfirmationModalComponent } from '../../../components/confirmation_modal/confirmation_modal.component';
import { TruncateEmailPipe } from '../../../pipes/truncate-email.pipe';

/**
 * Composant responsable de la modification des utilisateurs (stagiaires ou admins).
 *
 * @description
 * Ce composant permet :
 * - de charger la liste des utilisateurs depuis le service `UserService`
 * - d'afficher les utilisateurs avec pagination et recherche
 * - de sélectionner un utilisateur et modifier ses informations (nom, email, société, etc.)
 * - de confirmer la mise à jour via un modal avant de l'envoyer au serveur
 * - de réinitialiser ou annuler la modification
 *
 * @usageNotes
 * ### Importation
 * Ce composant utilise :
 * - `CommonModule`, `FormsModule`, `ReactiveFormsModule`
 * - `SearchBarComponent` pour la recherche
 * - `PaginationComponent` pour la pagination
 * - `ConfirmationModalComponent` pour afficher une confirmation avant mise à jour
 *
 * @example
 * ```html
 * <app-utilisateur-stagiaire></app-utilisateur-stagiaire>
 * ```
 *
 * @selector app-utilisateur-stagiaire
 * @component
 */
@Component({
  selector: 'app-utilisateur-stagiaire',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SearchBarComponent,
    PaginationComponent,
    ConfirmationModalComponent,
    TruncateEmailPipe,
  ],
  templateUrl: './modification-utilisateur.component.html',
})
export class ModificationUtilisateurComponent implements OnInit {
  /**
   * Liste complète des utilisateurs récupérés depuis l'API.
   */
  users: User[] = [];
  /**
   * Utilisateur actuellement sélectionné pour modification.
   */
  selectedUser: User | null = null;
  /**
   * Formulaire réactif pour la modification des informations de l'utilisateur.
   */
  form: FormGroup;
  /**
   * Numéro de la page courante pour la pagination.
   */
  currentPage = 1;
  /**
   * Nombre d'utilisateurs affichés par page.
   */
  pageSize = 5;
  /**
   * Sauvegarde de l'état de l'utilisateur avant modification.
   */
  selectedUserBefore!: User;
  /**
   * État de l'utilisateur après modification (pour confirmation).
   */
  selectedUserAfter!: User;
  /**
   * Message d'alerte affiché après action.
   */
  message: string | null = null;
  /**
   * Classe CSS de l'alerte (success/danger).
   */
  messageClass: string = '';
  /**
   * Liste des utilisateurs filtrés selon le terme de recherche.
   */
  filteredUsers: User[] = [];
  /**
   * Terme de recherche saisi dans la barre de recherche.
   */
  searchTerm = '';
  /**
   * Utilisateurs affichés sur la page courante (pagination).
   */
  paginatedUsers: User[] = [];
  /** Etat chargement des données */
  isLoading = true;
  SmallScreenSize = 787;
  isSmallScreen = window.innerWidth < this.SmallScreenSize;

  /**
   * Constructeur du composant.
   * @param userService Service de gestion des utilisateurs
   * @param fb FormBuilder pour créer les formulaires réactifs
   * @param cdr ChangeDetectorRef pour forcer la détection des changements après chargement asynchrone
   */
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      society: ['', Validators.required],
      password: [''],
      admin: [false],
    });

    // Ajout : écoute les changements sur admin
    this.form.get('admin')?.valueChanges.subscribe((isAdmin: boolean) => {
      if (isAdmin) {
        this.form.patchValue({ society: 'LECLIENT' });
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = event.target.innerWidth < this.SmallScreenSize;
  }
  /**
   * Cycle de vie Angular : Initialisation du composant.
   * Charge les utilisateurs depuis le backend.
   */
  ngOnInit() {
    this.loadUsers();
    this.isSmallScreen = window.innerWidth < this.SmallScreenSize;
  }

  /**
   * Charge tous les utilisateurs via le service et initialise la pagination.
   */
  loadUsers() {
    this.isLoading = true;

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.paginatedUsers = this.filteredUsers.slice(0, 5);

        this.isLoading = false; // ✅ fin du chargement
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  /**
   * Sélectionne un utilisateur pour modification et pré-remplit le formulaire.
   * @param user Utilisateur à modifier
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
  }

  /**
   * Affiche le modal de confirmation avant validation des changements.
   */
  onSubmit() {
    if (!this.selectedUser) return;

    if (this.form.valid) {
      const updatedData = { ...this.form.value };
      updatedData.admin = updatedData.admin || false;

      const modalEl = document.getElementById('confirmationModal');
      const modal = new bootstrap.Modal(modalEl!);

      this.selectedUserBefore = { ...this.selectedUser };
      this.selectedUserAfter = { ...this.selectedUser, ...updatedData };

      modal.show();
    }
  }

  /**
   * Filtre la liste des utilisateurs selon le terme saisi.
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

  /**
   * Annule la modification en cours et vide le formulaire.
   */
  cancelEdit() {
    this.selectedUser = null;
    this.form.reset(); // (optionnel) pour vider les champs du formulaire
  }

  /**
   * Confirme la modification après validation dans le modal.
   * Met à jour l'utilisateur via le service puis recharge la liste.
   */
  confirmUpdate() {
    if (!this.selectedUser) {
      this.message = 'Impossible de modifier cet utilisateur.';
      this.messageClass = 'alert alert-danger';
      setTimeout(() => (this.message = null), 2000);
      return;
    }

    const updatedData = { ...this.form.value };
    updatedData.admin = updatedData.admin || false;

    this.userService
      .updateUser(this.selectedUser.id_user!, updatedData)
      .subscribe({
        next: (user) => {
          console.log('Utilisateur mis à jour', user);
          this.loadUsers();
          this.selectedUser = null;
          this.form.reset();
          const modalEl = document.getElementById('confirmationModal');
          const modal = bootstrap.Modal.getInstance(modalEl!);
          modal?.hide();
        },
        error: (err) => console.error(err),
      });
    this.message = `Utilisateur "${this.selectedUser?.name}" modifié avec succès !`;
    this.messageClass = 'alert alert-success';
    setTimeout(() => (this.message = null), 2000);
  }

  /**
   * Réinitialise le formulaire avec les valeurs initiales de l'utilisateur sélectionné
   * ou vide complètement les champs si aucun utilisateur n'est sélectionné.
   */
  resetForm() {
    if (this.selectedUser) {
      // Remet les valeurs du formulaire à celles de l'utilisateur sélectionné
      this.form.patchValue({
        name: this.selectedUser.name,
        firstname: this.selectedUser.firstname,
        email: this.selectedUser.email,
        society: this.selectedUser.society,
        password: '', // on ne pré-remplit jamais le mot de passe
        admin: this.selectedUser.admin || false,
      });
    } else {
      // Si aucun utilisateur sélectionné, vide tous les champs
      this.form.reset({
        name: '',
        firstname: '',
        email: '',
        society: '',
        password: '',
        admin: false,
      });
    }
  }
}
