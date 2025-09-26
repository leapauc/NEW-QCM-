import { AttemptResponse } from './attemptResponse';

export interface AttemptQuestion {
  id_question: number;
  question: string;
  type: 'single' | 'multiple';
  responses: AttemptResponse[];
}
