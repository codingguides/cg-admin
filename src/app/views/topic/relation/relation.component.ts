import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from 'src/app/common/http-call.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss'],
})
export class RelationComponent {

  questions: any = [];
  selectedId: any = [];
  errMessage: string = '';
  errFlag: boolean = true;
  formGroup: any;
  totalLength: any;
  page: number = 1;
  limit: number = 1000;
  searchErrFlag: boolean = false
  topicByID: any;
  topicFlag: boolean = false
  questionFlag: boolean = false
  items = [1, 2, 3, 4];
  relationListByTopic: any;
  relationListFlag: boolean = false;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router,
    private activtedrouter: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      level: new FormControl('', []),
      search: new FormControl('', []),
      tag: new FormControl('', []),
    });
  }

  get level() {
    return this.formGroup.get('level');
  }

  get search() {
    return this.formGroup.get('search');
  }

  get tag() {
    return this.formGroup.get('tag');
  }

  async ngOnInit() {
    await this.getId();
    await this.relationList();
  }

  async getId() {
    await this.commonservice
      .get(`topic/get/${this.activtedrouter.snapshot.params['id']}`)
      .subscribe(async (result: any) => {
        if (result && result.status == 'SUCCESS') {
          this.topicByID = result && result.payload[0];
          console.log("this.topicByID>>>>>>>", this.topicByID.length)
        } else {
          this._router.navigate(['./topic/list']);
        }
      });
  }

  async getQuestion(params: any) {
    this.questionFlag = false;
    console.log(params)
    await this.commonservice.put(params, 'questions/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.questions = apiResult && apiResult.payload;

      if (apiResult && apiResult.status == 'SUCCESS') {
        this.questionFlag = true;
        this.questions = apiResult && apiResult.payload;
        this.questions.map((question: any) => { });
      } else {
        this.errFlag = true;
        this.errMessage = apiResult.msg;
      }
    });
  }

  async onSubmit(formData: any) {
    this.searchErrFlag = false
    console.log("formData>>>>>>>>>>>>>>>>", formData)
    // if (formData.level == '' && formData.search == '') {
    //   this.searchErrFlag = true
    // }
    await this.getQuestion({
      page: this.page,
      limit: this.limit,
      level: formData.level,
      search: formData.search,
      tag: formData.tag
    });
  }

  clear() {
    this.formGroup.reset();
  }

  addId(id: any) {
    this.selectedId.push(id);
    this.selectedId = [...new Set(this.selectedId)];
  }

  removeTags(str: any) {
    if (str === null || str === '') return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
  }

  add() {
    if (this.selectedId.length > 0) {
      console.log("this.selectedId>>>>>>", this.selectedId)

      let count = 0;
      this.selectedId.map(async (qid: any) => {
        console.log("qid>>>>>>", qid)
        await this.commonservice
          .post(
            {
              question_id: qid,
              topic_id: this.activtedrouter.snapshot.params['id'],
            },
            'relation/add'
          )
          .subscribe((res: any) => {
            const apiResult = JSON.parse(JSON.stringify(res));
            if (apiResult && apiResult.status == 'SUCCESS') {
              count++;
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `Total ${count} question added succesfully.`,
                showConfirmButton: false,
                timer: 1000,
              });
            }
          })
      });


    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: "Please select question.",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  }


  delete(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: true,
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
            .delete(`relation/delete/${id}`)
            .subscribe((res) => {
              const apiResult = JSON.parse(JSON.stringify(res));
              if (apiResult.status == 'SUCCESS') {
                this.relationList();
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

  async relationList() {
    console.clear()
    console.log(this.activtedrouter.snapshot.params['id'])
    await this.commonservice
      .get(
        `relation/get/${this.activtedrouter.snapshot.params['id']}`
      )
      .subscribe((res: any) => {
        console.log("under sub>>>>>>>>>>", res)
        this.relationListFlag = false;
        const apiResult = JSON.parse(JSON.stringify(res));
        console.log("apiResult>>>>>>>>>>", apiResult)

        if (apiResult && apiResult.status == 'SUCCESS') {
          console.log("if>>>>>>>>>>", apiResult.status)

          this.relationListByTopic = apiResult && apiResult.payload;
          console.log("this.relationListByTopic>>>>>>>>>>", this.relationListByTopic)

          if (this.relationListByTopic.length == 0) {
            console.log("if this.relationListByTopic>>>>>>>>>>", this.relationListByTopic.length)
            this.relationListFlag = true;
          } else {
            console.log("false")
            this.relationListFlag = false;
          }
        }
      })
  }
}
