import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-suppression-utilisateur',
  imports: [CommonModule, FormsModule],
  templateUrl: './suppression-utilisateur.component.html',
})
export class SuppressionUtilisateurComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  form: FormGroup;
  currentPage = 1;
  pageSize = 5;
  filteredUsers: User[] = [];
  searchTerm = '';

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      society: ['', Validators.required],
      password: [''],
      admin: [false],
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
      },
      error: (err) =>
        console.error("Erreur chargement de l'utilisateurs :", err),
    });
  }

  openConfirmModal() {
    const modalEl = document.getElementById('confirmModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

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

    this.currentPage = 1; // ✅ Réinitialise pagination après recherche
  }
  // Mettre à jour les utilisateurs affichés en fonction de la page
  // Pagination simple
  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.users.length)
      this.currentPage++;
  }
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  // Supprimer l'utilisateur sélectionné
  message: string | null = null;
  messageClass: string = '';

  deleteUser(): void {
    if (!this.selectedUser || this.selectedUser.id_user == null) return;

    this.userService.deleteUser(this.selectedUser.id_user).subscribe({
      next: () => {
        this.message = `Utilisateur "${this.selectedUser?.name}" supprimé avec succès !`;
        this.messageClass = 'alert alert-success'; // vert
        this.loadUsers();
        this.selectedUser = null;

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
