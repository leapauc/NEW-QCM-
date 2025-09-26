import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-utilisateur-stagiaire',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modification-utilisateur.component.html',
})
export class ModificationUtilisateurComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  form: FormGroup;
  currentPage = 1;
  pageSize = 5;
  selectedUserBefore!: User;
  selectedUserAfter!: User;
  message: string | null = null;
  messageClass: string = '';
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

    // 👇 Ajout : écoute les changements sur admin
    this.form.get('admin')?.valueChanges.subscribe((isAdmin: boolean) => {
      if (isAdmin) {
        this.form.patchValue({ society: 'LECLIENT' });
      }
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users]; // initialise tableau filtré
      },
      error: (err) => console.error(err),
    });
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
  }

  onSubmit() {
    if (!this.selectedUser) return;

    if (this.form.valid) {
      const updatedData = { ...this.form.value };
      updatedData.admin = updatedData.admin || false;

      const modalEl = document.getElementById('confirmModal');
      const modal = new bootstrap.Modal(modalEl!);

      this.selectedUserBefore = { ...this.selectedUser };
      this.selectedUserAfter = { ...this.selectedUser, ...updatedData };

      modal.show();
    }
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
  cancelEdit() {
    this.selectedUser = null;
    this.form.reset(); // (optionnel) pour vider les champs du formulaire
  }

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
          const modalEl = document.getElementById('confirmModal');
          const modal = bootstrap.Modal.getInstance(modalEl!);
          modal?.hide();
        },
        error: (err) => console.error(err),
      });
    this.message = `Utilisateur "${this.selectedUser?.name}" modifié avec succès !`;
    this.messageClass = 'alert alert-success';
    setTimeout(() => (this.message = null), 2000);
  }
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
}
