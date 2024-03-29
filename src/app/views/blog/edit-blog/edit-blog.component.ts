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
  styleUrls: ['./edit-blog.component.scss'],
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
  selectedCategory: any;
  selectedSubCategory: any;
  sortSlugError: any = {
    flag: false,
    message: '',
  };
  sortSlug: string = '';
  editorData: any = '<p>Enter text</p>';

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
      sort_title: new FormControl('', [Validators.required]),
      sort_slug: new FormControl('', [Validators.required]),
    });
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

  get sort_title() {
    return this.formGroup.get('sort_title');
  }

  get sort_slug() {
    return this.formGroup.get('sort_slug');
  }

  async ngOnInit() {
    await this.getId();
    await this.getTopic();
  }

  async getId() {
    await this.commonservice
      .get(`blog/get/${this.router.snapshot.params['id']}`)
      .subscribe(async (result: any) => {
        const apiResult = JSON.parse(JSON.stringify(result));
        console.log(apiResult);

        if (result && result.status == 'SUCCESS') {
          this.blogByID = result && result.payload[0];

          this.selectedCategory = this.blogByID.catDetails[0].category;
          this.selectedSubCategory = this.blogByID.catDetails[0].sub_category;
          console.log('this.selectedCategory', this.selectedCategory);
          console.log('this.selectedCategory', this.selectedSubCategory);
          await this.getCate('', this.selectedCategory);

          this.updateDesc = this.blogByID.description;

          this.formGroup = this.formBuilder.group({
            title: new FormControl(this.blogByID.title),
            slug: new FormControl(this.blogByID.slug),
            description: new FormControl(this.blogByID.description),
            feature_image: new FormControl(this.blogByID.feature_image),
            feature_video: new FormControl(this.blogByID.feature_video),
            topic_id: new FormControl(this.blogByID.topic_id),
            category_id: new FormControl(this.blogByID.category_id),
            sort_title: new FormControl(this.blogByID.sort_title),
            sort_slug: new FormControl(this.blogByID.sort_slug),
          });
        }
      });
  }

  async getCate(val: any, selected: any) {
    this.topicCate = [];
    let value = '';
    if (selected.length > 0) {
      value = selected;
    } else {
      this.selectedTopic = JSON.parse(val.target.value);
      value = this.selectedTopic.slug;
    }

    if (value) {
      console.log('selectedTopic.slug>>>>>>>>>>>>>', value);
      await this.commonservice
        .get(`blog/get/category/${value}`)
        .subscribe((res) => {
          const apiResult = JSON.parse(JSON.stringify(res));
          let tres = apiResult && apiResult.payload;
          this.isCategory = tres.length > 0 ? true : false;
          tres.map((result: any) => {
            this.topicCate.push({
              ...result,
              selected:
                result.sub_category === this.selectedSubCategory ? true : false,
            });
          });
          console.log('this.topicCate', this.topicCate);
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

  createSortSlug(event: any) {
    this.sortSlugError.falg = false;
    this.sortSlugError.message = '';
    this.sortSlug = event.target.value
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

  validateSortSlug(event: any) {
    this.sortSlugError.flag = false;
    this.sortSlugError.message = '';
    if (event.target.value == '') {
      this.sortSlugError.flag = true;
      this.sortSlugError.message = 'Sort Slug is required!';
    }
  }

  async getTopic() {
    await this.commonservice.get('topic/list').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      let tres = apiResult && apiResult.payload;
      tres.map((result: any) => {
        if (result.parent_id == null) {
          console.log(result.slug, '==1111==', this.selectedCategory);
          this.topics.push({
            ...result,
            selected: result.slug === this.selectedCategory ? true : false,
          });
        }
      });
      console.log('this.topics', this.topics);
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
      topic_id: this.selectedTopic.topic_id,
      category_id: formData['category_id'],
      sort_title: formData['sort_title'],
      sort_slug: formData['sort_slug'] ? formData['sort_slug'] : this.sortSlug,
    };
    this.commonservice
      .put(data, `blog/update/${this.router.snapshot.params['id']}`)
      .subscribe((res) => {
        const apiResult = JSON.parse(JSON.stringify(res));

        if (apiResult && apiResult.status == 'SUCCESS') {
          this.formGroup.reset();
          this.getUserDetails = '';
          this.updateDesc = '';

          // this.ngOnInit();
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
      });
  }
}
