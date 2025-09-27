import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
} from '@angular/forms';
import { QcmService } from '../../../services/qcm.service';
import { QuestionService } from '../../../services/question.service';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS
import { QuestionResponse } from '../../../models/questionResponse';

/**
 * @component
 * @name ModificationQuestionComponent
 * @description
 * Composant pour la modification des questions d'un QCM.
 *
 * Ce composant permet à un utilisateur de :
 * - Sélectionner un QCM parmi ceux disponibles
 * - Visualiser la liste des questions du QCM
 * - Sélectionner une question et charger ses réponses existantes
 * - Modifier la question et ses réponses
 * - Ajouter ou supprimer des réponses (avec un minimum et maximum défini)
 * - Déterminer automatiquement le type de question (single/multiple) selon le nombre de réponses correctes
 * - Sauvegarder les modifications via le service `QuestionService`
 * - Afficher un modal de succès ou d'échec avec Bootstrap
 *
 * Il utilise les services suivants :
 * - `QcmService` : pour récupérer les QCM et leurs questions
 * - `QuestionService` : pour récupérer et mettre à jour les questions et leurs réponses
 *
 * Le formulaire est un formulaire réactif (`ReactiveFormsModule`) avec un `FormArray` pour les réponses.
 *
 * @example
 * ```html
 * <app-modification-question></app-modification-question>
 * ```
 */
@Component({
  selector: 'app-modification-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modification-question.component.html',
})
export class ModificationQuestionComponent implements OnInit {
  /** Liste des QCM disponibles */
  qcms: any[] = [];
  /** Liste des questions du QCM sélectionné */
  questions: any[] = [];
  /** ID du QCM actuellement sélectionné */
  selectedQcmId: number | null = null;
  /** ID de la question actuellement sélectionnée */
  selectedQuestionId: number | null = null;
  /** Formulaire réactif pour la question et ses réponses */
  questionForm!: FormGroup;

  /** Nombre maximum de réponses autorisées par question */
  maxResponses = 5;
  /** Nombre minimum de réponses obligatoires par question */
  minResponses = 2;

  /**
   * Constructeur
   *
   * @param fb FormBuilder pour créer et gérer le formulaire réactif
   * @param qcmService Service pour récupérer les QCM et leurs questions
   * @param questionService Service pour récupérer et mettre à jour les questions
   */
  constructor(
    private fb: FormBuilder,
    private qcmService: QcmService,
    private questionService: QuestionService
  ) {}

  /** Lifecycle hook : initialisation du composant */
  ngOnInit() {
    this.loadQcms();
    this.initForm();
    this.addResponse();
    this.addResponse();
  }

  // -------- Form Initialization --------
  /** Initialise le formulaire réactif pour la question et ses réponses */
  initForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      responses: this.fb.array([]),
    });
  }

  /** Retourne le FormArray des réponses du formulaire */
  get responses(): FormArray {
    return this.questionForm.get('responses') as FormArray;
  }

  /**
   * Crée un FormGroup pour une réponse
   * @param text Texte de la réponse
   * @param isCorrect Indique si la réponse est correcte
   * @returns FormGroup représentant la réponse
   */
  createResponse(text = '', isCorrect = false): FormGroup {
    return this.fb.group({
      text: [text, Validators.required],
      isCorrect: [isCorrect],
    });
  }

  /**
   * Ajoute une réponse au formulaire si le maximum n’est pas atteint
   * @param text Texte de la réponse
   * @param isCorrect Indique si la réponse est correcte
   */
  addResponse(text = '', isCorrect = false) {
    if (this.responses.length < this.maxResponses) {
      this.responses.push(this.createResponse(text, isCorrect));
    }
  }

  /**
   * Supprime une réponse du formulaire si le minimum n’est pas atteint
   * @param index Index de la réponse à supprimer
   */
  removeResponse(index: number) {
    if (this.responses.length > this.minResponses) {
      this.responses.removeAt(index);
    }
  }

  // -------- Load QCMs and Questions --------
  /** Charge tous les QCM depuis le service */
  loadQcms() {
    this.qcmService.getAllQCM().subscribe({
      next: (data) => (this.qcms = data),
      error: (err) => console.error('Erreur chargement QCMs', err),
    });
  }

  /**
   * Sélection d’un QCM
   * @param event Event provenant du select
   */
  onQcmChange(event: any) {
    this.selectedQcmId = +event.target.value;

    // Réinitialiser la sélection de la question
    this.selectedQuestionId = null;

    // Vider le formulaire
    this.questionForm.reset();
    while (this.responses.length) {
      this.responses.removeAt(0);
    }

    // Charger les questions du nouveau QCM
    if (this.selectedQcmId) {
      this.loadQuestionsByQcm(this.selectedQcmId);
    }
  }

  /** Charge les questions d’un QCM spécifique */
  loadQuestionsByQcm(qcmId: number) {
    this.qcmService.getQcmQuestions(qcmId).subscribe({
      next: (data) => (this.questions = data),
      error: (err) => {
        console.error('Erreur chargement questions', err);
        this.questions = [];
      },
    });
  }

  /**
   * Sélection d’une question
   * @param event Event provenant du select
   */
  onQuestionChange(event: any) {
    this.selectedQuestionId = +event.target.value;
    if (this.selectedQuestionId)
      this.loadQuestionDetails(this.selectedQuestionId);
  }

  /** Charge les détails d’une question et ses réponses */
  loadQuestionDetails(questionId: number) {
    this.questionService.getQuestionReponseById(questionId).subscribe({
      next: (data: QuestionResponse[]) => {
        // ✅ correspond maintenant au type Observable<>
        if (!data || data.length === 0) return;

        const first = data[0];

        this.questionForm.patchValue({
          question: first.question,
        });

        // Clear old responses
        while (this.responses.length) this.responses.removeAt(0);

        // Add responses from backend
        data.forEach((r: QuestionResponse) => {
          this.addResponse(r.response, r.is_correct);
        });
      },
      error: (err) => console.error('Erreur chargement détails question', err),
    });
  }

  /** Réinitialise le formulaire et le FormArray des réponses */
  cancelForm() {
    this.selectedQuestionId = null;
    this.questionForm.reset();
    while (this.responses.length) {
      this.responses.removeAt(0);
    }
  }
  /**
   * Recharge la question et ses réponses depuis le backend
   * (utile pour annuler les modifications)
   */
  resetForm() {
    if (!this.selectedQuestionId) return;

    // Recharger les valeurs originales depuis le service
    this.questionService
      .getQuestionReponseById(this.selectedQuestionId)
      .subscribe({
        next: (data: QuestionResponse[]) => {
          if (!data || data.length === 0) return;

          const first = data[0];

          // Remettre le titre
          this.questionForm.patchValue({ question: first.question });

          // Vider les réponses existantes
          while (this.responses.length) this.responses.removeAt(0);

          // Remettre les réponses originales
          data.forEach((r) => this.addResponse(r.response, r.is_correct));
        },
        error: (err) => console.error('Erreur réinitialisation question', err),
      });
  }

  // -------- Submit Form --------
  /** Soumet le formulaire et met à jour la question via le service */
  submitForm() {
    if (!this.selectedQcmId || !this.selectedQuestionId) {
      alert('Veuillez sélectionner un QCM et une question');
      return;
    }

    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const formValue = this.questionForm.value;
    const validResponses = formValue.responses
      .filter((r: any) => r.text.trim() !== '')
      .map((r: any, index: number) => ({
        response: r.text,
        is_correct: r.isCorrect,
        position: index + 1,
      }));

    if (validResponses.length < this.minResponses) {
      alert(`Il faut au moins ${this.minResponses} réponses non vides.`);
      return;
    }

    type QuestionType = 'single' | 'multiple';

    const correctCount = validResponses.filter(
      (r: { is_correct: boolean }) => r.is_correct
    ).length;
    const questionType: QuestionType = correctCount > 1 ? 'multiple' : 'single';

    const dataToUpdate: {
      question: string;
      type: QuestionType;
      responses: any[];
    } = {
      question: formValue.question,
      type: questionType,
      responses: validResponses,
    };

    this.questionService
      .updateQuestion(this.selectedQuestionId, dataToUpdate)
      .subscribe({
        next: (res) => {
          // Afficher le modal Bootstrap
          const modalEl = document.getElementById('successModal');
          const modal = new bootstrap.Modal(modalEl!);
          modal.show();
        },
        error: (err) => {
          console.error(err);
          // Afficher le modal Bootstrap
          const modalEl = document.getElementById('failedModal');
          const modal = new bootstrap.Modal(modalEl!);
          modal.show();
        },
      });
    this.cancelForm();
  }
}
