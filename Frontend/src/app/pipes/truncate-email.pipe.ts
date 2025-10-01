import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncateEmail' })
export class TruncateEmailPipe implements PipeTransform {
  transform(value: string, limit: number = 10): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
