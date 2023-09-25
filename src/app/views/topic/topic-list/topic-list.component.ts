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
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss'],
})
export class TopicListComponent {
  topics: any = [];
  errMessage: string = '';
  errFlag: boolean = true;
  page: number = 1;
  limit: number = 3;
  totalPages!: number;
  currentPage!: number;
  lastElement!: number;
  parray: any = [];
  searchoption: any = '';
  formGroup!: FormGroup;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      type: new FormControl('', [Validators.required]),
      search: new FormControl('', [Validators.required]),
    });
  }

  get type() {
    return this.formGroup.get('type');
  }

  get search() {
    return this.formGroup.get('search');
  }

  ngOnInit() {
    this.getTopic({
      page: this.page,
      limit: this.limit,
    });
  }

  async getTopic(params: Object) {
    await this.commonservice.put(params, 'topic/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      console.log(apiResult.payload);
      if (apiResult && apiResult.status == 'SUCCESS') {
        this.topics = apiResult && apiResult.payload;
        this.totalPages = apiResult.totalPages;
        this.currentPage = apiResult.currentPage;
        this.parray = [];
        for (let index = 1; index <= this.totalPages; index++) {
          this.parray.push(index)
        }
        this.lastElement = this.parray[this.parray.length - 1];
      } else if (apiResult && apiResult.status == 'ERROR') {
        this.errFlag = true;
        this.errMessage = apiResult.msg;
        this.topics = [];
        this.totalPages = 0;
        this.currentPage = 0;
      }
    });
  }

  async updateTopic(pageno: number) {
    this.currentPage = pageno;
    await this.getTopic({
      page: pageno,
      limit: this.limit,
    });
  }

  async previous(pageno: number) {
    this.currentPage = pageno - 1;
    console.log(">>>>>>>>>>>>>>>>", {
      page: this.currentPage,
      limit: this.limit,
    })
    await this.getTopic({
      page: this.currentPage,
      limit: this.limit,
    });
  }

  async next(pageno: number) {
    this.currentPage = pageno + 1;
    console.log(">>>>>>>>>>>>>>>>", {
      page: this.currentPage,
      limit: this.limit,
    })
    await this.getTopic({
      page: this.currentPage,
      limit: this.limit,
    });
  }

  getParentName(topic: any) {
    if (topic.parentDetails.length > 0) {
      return topic.parentDetails[0].name;
    }
  }

  delete(topicid: any) {
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
            .delete(`topic/delete/${topicid}`)
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

  range(start: number, end: number) {
    return Array.apply(1, Array(end)).map((element, index) => index + start);
  }

  searchOption(event: any) { }

  async onSubmit(formData: any) {
    if (formData.type !== '' && formData.search !== '') {
      await this.getTopic({
        page: this.page,
        limit: this.limit,
        type: formData.type,
        search: formData.search,
      });
      console.log(formData.type)
    }
  }

  clear() {
    this.formGroup.reset();
  }
}
