import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCallService } from 'src/app/common/http-call.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog-relation',
  templateUrl: './blog-relation.component.html',
  styleUrls: ['./blog-relation.component.scss'],
})
export class BlogRelationComponent {
  tname: string | null = localStorage.getItem('tname');
  formGroup!: FormGroup;
  blogs: any = [];
  activeBlogs: any = [];
  errMessage: string = '';
  errFlag: boolean = true;
  page: number = 1;
  totalLength: any;
  limit: number = 1000;
  showSearch: boolean = true;
  parray: any = [];
  searchoption: any = '';
  selectedBlog!: any;

  blogById: any;
  blogFlag: boolean = false;
  searchErrFlag: boolean = false;
  selectedId: any = [];
  relationIds: any = [];
  relationListFlag: boolean = false;
  relationListByBlog: any;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private activtedrouter: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      type: new FormControl('', [Validators.required]),
      search: new FormControl('', []),
      status: new FormControl('', []),
    });
  }

  get type() {
    return this.formGroup.get('type');
  }

  get search() {
    return this.formGroup.get('search');
  }
  get status() {
    return this.formGroup.get('status');
  }

  async ngOnInit() {
    this.getId();
    await this.relationList();
  }

  async getId() {
    await this.commonservice
      .get(`topic/get/${this.activtedrouter.snapshot.params['id']}`)
      .subscribe((result: any) => {
        if (result && result.status == 'SUCCESS') {
          console.log(result);
          this.blogById = result && result.payload[0];
          console.log('this.topicByID>>>>>>>', this.blogById.length);
        } else {
          this._router.navigate(['./blog/list']);
        }
      });
  }

  async getBlog(params: any) {
    this.blogFlag = false;
    console.log(params);

    await this.commonservice.put(params, 'blog/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.blogs = apiResult && apiResult.payload;
      console.log(this.blogs);
      if (apiResult && apiResult.status == 'SUCCESS') {
        this.blogFlag = true;
        this.blogs = apiResult && apiResult.payload;
      } else {
        this.errFlag = true;
        this.errMessage = apiResult.msg;
      }
    });
  }

  async onSubmit(formData: any) {
    this.searchErrFlag = false;
    console.log('formData>>>>>>>>>>>>>>>>', formData);

    await this.getBlog({
      page: this.page,
      limit: this.limit,
      type: formData.type,
      search: formData.search,
      status: formData.status,
    });
  }

  clear() {
    this.formGroup.reset();
  }

  addId(id: any) {
    let found = this.selectedId.find((arrid: number) =>
      arrid == id ? true : false
    );
    if (found) {
      this.selectedId = this.selectedId.filter((item: any) => {
        return item !== found;
      });
    } else {
      this.selectedId.push(id);
      this.selectedId = [...new Set(this.selectedId)];
    }
  }

  checkRow(id: any) {
    const found = this.relationIds.find((element: any) => element == id);
    return found ? true : false;
  }

  removeTags(str: any) {
    if (str === null || str === '') return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
  }

  add() {
    if (this.selectedId.length > 0) {
      console.log('this.selectedId>>>>>>', this.selectedId);

      let count = 0;
      this.selectedId.map(async (bid: any) => {
        console.log('bid>>>>>>', bid);
        await this.commonservice
          .post(
            {
              blog_id: bid,
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
          });
      });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Please select question.',
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
    // console.clear();
    console.log(this.activtedrouter.snapshot.params['id']);
    await this.commonservice
      .get(`relation/get/blog/${this.activtedrouter.snapshot.params['id']}`)
      .subscribe((res: any) => {
        console.log('under sub>>>>>>>>>>', res);
        this.relationListFlag = false;
        const apiResult = JSON.parse(JSON.stringify(res));
        console.log('apiResult>>>>>>>>>>', apiResult);

        if (apiResult && apiResult.status == 'SUCCESS') {
          console.log('if>>>>>>>>>>', apiResult.status);

          this.relationListByBlog = apiResult && apiResult.payload;
          console.log(
            'this.relationListByBlog>>>>>>>>>>',
            this.relationListByBlog
          );
          this.relationIds = this.relationListByBlog.map(
            (val: any) => val.blog_id
          );

          if (this.relationListByBlog.length == 0) {
            console.log(
              'if this.relationListByTopic>>>>>>>>>>',
              this.relationListByBlog.length
            );
            this.relationListFlag = true;
          } else {
            console.log('false');
            this.relationListFlag = false;
          }
        }
      });
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
            .put(
              {
                status: value.status == 'draft' ? 'publish' : 'draft',
              },
              `blog/update/${value._id}`
            )
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
      });
  }

  changeSearch(event: any) {
    if (event.target.value == 'status') {
      this.showSearch = false;
    } else {
      this.showSearch = true;
    }
  }
}
