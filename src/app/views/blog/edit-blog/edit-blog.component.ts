import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from 'src/app/common/http-call.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss']
})
export class EditBlogComponent {

  public favoriteColor = '#26ab3c';
  updateDesc: any = '';
  formGroup!: FormGroup;
  blogs!: any[];
  blogSlug: string = '';
  getUserDetails: any;
  blogByID: any = {};
  config: any;
  slugError: any = {
    flag: false,
    message: '',
  };
  topics: any[] = [];
  topicCate: any[] = [];
  isCategory: boolean = true;
  selectedTopic: any = {};
  selectedCategory: any
  selectedSubCategory: any

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute
  ) {
    this.config = this.commonservice.getConfigOfCKEditor();

    this.formGroup = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      slug: new FormControl('', [Validators.required]),
      feature_image: new FormControl('', [Validators.required]),
      feature_video: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      topic_id: new FormControl('', []),
      category_id: new FormControl('', [Validators.required]),
    })
  }

  get title() {
    return this.formGroup.get('title');
  }

  get slug() {
    return this.formGroup.get('slug');
  }

  get feature_image() {
    return this.formGroup.get('feature_image');
  }

  get feature_video() {
    return this.formGroup.get('feature_video');
  }

  get description() {
    return this.formGroup.get('description');
  }

  get category_id() {
    return this.formGroup.get('category_id');
  }

  get topic_id() {
    return this.formGroup.get('topic_id');
  }


  async ngOnInit() {
    await this.getId();
    await this.getTopic();

  }

  async getId() {
    await this.commonservice
      .get(`blog/get/${this.router.snapshot.params['id']}`)
      .subscribe((result: any) => {
        const apiResult = JSON.parse(JSON.stringify(result));
        console.log(apiResult)

        if (result && result.status == 'SUCCESS') {
          this.blogByID = result && result.payload;
          const detailsArray = this.blogByID.map(async (details: any) => {

            this.selectedCategory = details.catDetails[0].category;
            this.selectedSubCategory = details.catDetails[0].sub_category
            console.log("this.selectedCategory", this.selectedCategory)
            console.log("this.selectedCategory", this.selectedSubCategory)
            await this.getCate(this.selectedCategory, '');

            // console.log(sss.sub_category)
            // console.log("ALL Details", details)
            // console.log("sssss>>>>>>", details.catDetails)
            // this.formGroup = this.formBuilder.group({
            //   title: new FormControl(details.title),
            //   slug: new FormControl(details.slug),
            //   description: new FormControl(details.description),
            // })

          })
        }
      });
  }

  async getCate(val: any, selected: any) {
    this.selectedTopic = JSON.parse(val.target.value);
    this.topicCate = [];
    let value = selected.length > 0 ? selected : this.selectedTopic.slug
    if (value) {
      console.log("selectedTopic.slug>>>>>>>>>>>>>", value)
      await this.commonservice.get(`blog/get/category/${value}`).subscribe((res) => {
        const apiResult = JSON.parse(JSON.stringify(res));
        let tres = apiResult && apiResult.payload;
        this.isCategory = tres.length > 0 ? true : false;
        tres.map((result: any) => {
          this.topicCate.push({
            ...result,
            selected: result.name === this.selectedSubCategory ? true : false,
          });
        })
        console.log("this.topicCate", this.topicCate)
      });
    }

  }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  createSlug(event: any) {
    this.slugError.flag = false;
    this.slugError.message = '';
    this.blogSlug = event.target.value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  validateSlug(event: any) {
    this.slugError.flag = false;
    this.slugError.message = '';
    if (event.target.value == '') {
      this.slugError.flag = true;
      this.slugError.message = 'Slug is required!';
    }
  }

  async getTopic() {
    await this.commonservice.get('topic/list').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      let tres = apiResult && apiResult.payload;
      tres.map((result: any) => {
        if (result.parent_id == null) {
          this.topics.push({
            ...result,
            selected: result.slug === this.selectedCategory ? true : false,
          })
        }
      })
      console.log("this.topics", this.topics)
    });
  }

  async onSubmit(formData: any) {
    const data = {
      title: formData['title'],
      slug: formData['slug'] ? formData['slug'] : this.blogSlug,
      description: this.updateDesc,
      user_id: this.getUserDetails,
      feature_image: formData['feature_image'],
      feature_video: formData['feature_video'],
    };
    this.commonservice
      .put(data, `blog/update/${this.router.snapshot.params['id']}`)
      .subscribe((res) => {
        const apiResult = JSON.parse(JSON.stringify(res));

        if (apiResult && apiResult.status == 'SUCCESS') {
          this.formGroup.reset();
          this.getUserDetails = '';
          this.ngOnInit();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: apiResult.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: apiResult.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
  }



}
