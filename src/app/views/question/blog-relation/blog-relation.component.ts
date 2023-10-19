import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCallService } from 'src/app/common/http-call.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-blog-relation',
  templateUrl: './blog-relation.component.html',
  styleUrls: ['./blog-relation.component.scss']
})
export class BlogRelationComponent {

  qname: string | null = localStorage.getItem('qname');
  formGroup!: FormGroup;
  blogs: any = [];
  activeBlogs:any = [];
  errMessage: string = '';
  errFlag: boolean = true;
  page: number = 1;
  totalLength: any;
  limit: number = 1000;
  showSearch: boolean = true;
  parray: any = [];
  searchoption: any = '';
  selectedBlog!: any;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private activtedrouter: ActivatedRoute,
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
    return this.formGroup.get('status')
  }

  ngOnInit() {
    this.relationList()
    this.getBlog({
      page: this.page,
      limit: this.limit,
    });
  }

  async getBlog(param: any) {
    await this.commonservice.put(param, 'blog/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      console.log(apiResult.payload);

      if (apiResult && apiResult.status == 'SUCCESS') {
        if(this.selectedBlog){
          this.activeBlogs = apiResult && apiResult.payload.filter((blog:any)=> blog._id == this.selectedBlog.blog_id)
          console.log("this.activeBlogs>>>>",this.activeBlogs)
        }
        if(param.type){
          this.blogs = apiResult && apiResult.payload.map((blog:any)=>{
            return {
              ...blog,
              isAdded: blog._id == this.selectedBlog.blog_id ? true :false
            }
          })
        }
       
        console.log("this.blogs>>>",this.blogs)
      } else if (apiResult && apiResult.status == 'ERROR') {
        this.errFlag = true;
        this.errMessage = apiResult.msg;
        this.blogs = [];
      }
    })
  }

  getParentName(blog: any) {
    if (blog.parentDetails.length > 0) {
      return blog.parentDetails[0].name;
    }
  }


  delete(blogid: any) {
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

    if (formData.type !== '' && formData.search !== '' || formData.type !== '' && formData.status !== '') {
      await this.getBlog({
        page: this.page,
        limit: this.limit,
        type: formData.type,
        search: formData.search,
        status: formData.status,
      });
      console.log(formData);
    }
  }

  clear() {
    this.formGroup.reset();
    this.ngOnInit();
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

  changeSearch(event: any) {
    if (event.target.value == 'status') {
      this.showSearch = false;
    } else {
      this.showSearch = true;
    }
  }

  async relationList() {
    await this.commonservice
      .get(`relation/get/blog/${this.activtedrouter.snapshot.params['id']}`)
      .subscribe(async (result: any) => {
        if (result && result.status == 'SUCCESS') {
          this.selectedBlog = result && result.payload[0];
          // console.log("this.selectedBlog>>>>>>", this.selectedBlog)
          console.log("this.selectedBlog>>>>>>", this.selectedBlog.blog_id)
        }
      });
  }

  async addRelation(id: any) {
    alert(id)
    if (id) {
      await this.commonservice
        .post(
          {
            question_id: this.activtedrouter.snapshot.params['id'],
            blog_id: id
          },
          'relation/add'
        )
        .subscribe((res: any) => {
          const apiResult = JSON.parse(JSON.stringify(res));
          if (apiResult && apiResult.status == 'SUCCESS') {
            this.toastr.success("Added");
            this.ngOnInit();
          }
        })
    }
  }


}
