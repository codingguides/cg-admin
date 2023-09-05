import { Component } from '@angular/core';
import { HttpCallService } from '../../../common/http-call.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent {
  questions: any = [];
  errMessage: string = '';
  errFlag: boolean = true;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private router: Router
  ) {}

  ngOnInit() {
    this.getquestion();
  }

  getquestion() {
    this.commonservice.get('questions/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.questions = apiResult && apiResult.payload;

      if (apiResult && apiResult.status == 'SUCCESS') {
        this.questions = apiResult && apiResult.payload;
        this.questions.map((question: any) => {});
      } else {
        this.errFlag = true;
        this.errMessage = apiResult.msg;
      }
    });
  }

  delete(questionid: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.commonservice
            .delete(`questions/delete/${questionid}`)
            .subscribe((res) => {
              const apiResult = JSON.parse(JSON.stringify(res));

              if (apiResult.status == 'SUCCESS') {
                this.ngOnInit();
                swalWithBootstrapButtons.fire(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                );
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }

  edit(question: any) {
    alert(question.point);
  }

  removeTags(str: any) {
    if (str === null || str === '') return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
  }
}
