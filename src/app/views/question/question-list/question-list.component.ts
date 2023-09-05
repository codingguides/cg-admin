import { Component } from '@angular/core';
import { HttpCallService } from '../../../common/http-call.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent {
  questions: any = [];
  errMessage: string = '';
  errFlag: boolean = true;
  page: number = 1;
  limit: number = 10;
  formGroup: any;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.formGroup = this.formBuilder.group({
      level: new FormControl('', []),
      search: new FormControl('', []),
    });
  }

  get level() {
    return this.formGroup.get('level');
  }

  get search() {
    return this.formGroup.get('search');
  }

  async ngOnInit() {
    await this.getQuestion({
      page: this.page,
      limit: this.limit
    });
  }

  async getQuestion(params: any) {
    await this.commonservice.put(params, 'questions/').subscribe((res) => {
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

  async onSubmit(formData: any) {
    console.log("formData>>>>>>>>>>>>>>>>",formData)
    if (formData.level !== '' || formData.search !== '') {
      await this.getQuestion({
        page: this.page,
        limit: this.limit,
        level: formData.level,
        search: formData.search,
      });
    }
  }

  clear(){
    this.formGroup.reset();
  }
}
