import { UserAnswer } from './userAnswer';

export interface AttemptPayload {
  id_user: number;
  id_qcm: number;
  started_at: string;
  ended_at: string;
  answers: UserAnswer[];
}
