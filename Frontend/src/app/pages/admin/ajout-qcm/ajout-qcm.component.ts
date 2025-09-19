import { Component } from '@angular/core';

@Component({
  selector: 'app-ajout-qcm',
  imports: [],
  templateUrl: './ajout-qcm.component.html',
  styleUrl: './ajout-qcm.component.css',
})
export class AjoutQcmComponent {
  // maxResponses = 5;
  // minResponses = 2;
  // addResponse(questionIndex: number) {
  //   const responses = this.getResponses(questionIndex);
  //   if (responses.length < this.maxResponses) {
  //     responses.push(
  //       this.fb.group({
  //         response: ['', Validators.required],
  //         is_correct: [false],
  //         position: [responses.length + 1],
  //       })
  //     );
  //   }
  // }
  // removeResponse(questionIndex: number, responseIndex: number) {
  //   const responses = this.getResponses(questionIndex);
  //   if (responses.length > this.minResponses) {
  //     responses.removeAt(responseIndex);
  //   }
  // }
}
