import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Composant de modal de confirmation réutilisable.
 *
 * @description
 * Ce composant affiche une modal avec un titre, un message et des boutons pour confirmer ou annuler une action.
 * Le type d'action (`update` ou `delete`) peut être utilisé pour adapter le style ou le comportement.
 *
 * @example
 * ```html
 * <app-confirmation-modal
 *   [title]="'Confirmer la suppression'"
 *   [message]="'Êtes-vous sûr de vouloir supprimer cet élément ?'"
 *   [actionType]="'delete'"
 *   (confirm)="handleConfirm()"
 *   (cancel)="handleCancel()">
 * </app-confirmation-modal>
 * ```
 *
 * @selector app-confirmation-modal
 * @component
 * @standalone
 * @templateUrl ./confirmation_modal.component.html
 */
@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation_modal.component.html',
})
export class ConfirmationModalComponent {
  /**
   * Titre de la modal.
   * @default 'Confirmation'
   */
  @Input() title: string = 'Confirmation';
  /**
   * Message affiché dans la modal.
   */
  @Input() message: string = '';
  /**
   * Type d'action à confirmer.
   * Peut influencer le style ou l'icône de la modal.
   * @default 'update'
   */
  @Input() actionType: 'update' | 'delete' = 'update';

  /**
   * Événement émis lorsque l'utilisateur confirme l'action.
   */
  @Output() confirm = new EventEmitter<void>();
  /**
   * Événement émis lorsque l'utilisateur annule l'action.
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Méthode appelée pour confirmer l'action.
   */
  onConfirm() {
    this.confirm.emit();
  }

  /**
   * Méthode appelée pour annuler l'action.
   */
  onCancel() {
    this.cancel.emit();
  }
}
