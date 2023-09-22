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
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent {
  formGroup!: FormGroup;
  blogs: any = [];
  errMessage: string = '';
  errFlag: boolean = true;
  page: number = 1
  totalLength: any

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
    this.getBlog();
  }

  getBlog() {
    this.commonservice.get('blog/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.blogs = apiResult && apiResult.payload;

      if (apiResult && apiResult.status == 'SUCCESS') {
        this.blogs = apiResult && apiResult.payload;
      } else if (apiResult && apiResult.status == 'ERROR') {
        this.errFlag = true;
        this.errMessage = apiResult.msg;
      }
    })
  }

  delete(blogid: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success btn-sm',
        cancelButton: 'btn btn-danger btn-sm',
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
            .delete(`blog/delete/${blogid}`)
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
      })
  }

  async onSubmit(formData: any) {
    if (formData.type !== '' && formData.search !== '') {
      // await this.getTopic({
      //   page: this.page,
      //   limit: this.limit,
      //   type: formData.type,
      //   search: formData.search,
      // });
    }
  }

  statusUpdate(value: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success btn-sm',
        cancelButton: 'btn btn-danger btn-sm',
      },
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure to change the status?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,

        confirmButtonText: 'Yes, change it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,

      })
      .then((result) => {
        if (result.isConfirmed) {
          this.commonservice
            .put({
              status: value.status == "draft" ? "publish" : "draft"
            }, `blog/update/${value._id}`)
            .subscribe((res) => {
              const apiResult = JSON.parse(JSON.stringify(res));
              if (apiResult.status == 'SUCCESS') {
                this.ngOnInit();
                swalWithBootstrapButtons.fire(
                  'Updated!',
                  'Your file has been Updated.',
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
      })

  }

}
