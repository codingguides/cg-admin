import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from 'src/app/common/http-call.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
})
export class AddQuestionComponent {
  public favoriteColor = '#26ab3c';
  public updateDesc: string = '';
  formGroup!: FormGroup;
  editorData: any = '<p>Enter text</p>';
  questions!: any[];
  questionSlug: string = '';
  getUserDetails: any;
  @ViewChild('div')
  div!: ElementRef;
  count: any = 0;
  options: any[] = [];
  selectedOption: any = '';
  config: any;
  page: number = 1;
  limit: number = 10;
  errMessage: string = '';
  errFlag: boolean = true;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.config = this.commonservice.getConfigOfCKEditor();
    this.formGroup = this.formBuilder.group({
      question: new FormControl(''),
      point: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      questiontype: new FormControl('', [Validators.required]),
      option1: new FormControl('', [Validators.required]),
      option2: new FormControl('', [Validators.required]),
      option3: new FormControl('', [Validators.required]),
      option4: new FormControl('', [Validators.required]),
      rightoption: new FormControl(''),
      tags: new FormControl('', [Validators.required]),
    });
  }

  get question() {
    return this.formGroup.get('question');
  }
  get point() {
    return this.formGroup.get('point');
  }
  get level() {
    return this.formGroup.get('level');
  }
  get questiontype() {
    return this.formGroup.get('questiontype');
  }
  get option1() {
    return this.formGroup.get('option1');
  }
  get option2() {
    return this.formGroup.get('option2');
  }
  get option3() {
    return this.formGroup.get('option3');
  }
  get option4() {
    return this.formGroup.get('option4');
  }
  get rightoption() {
    return this.formGroup.get('rightoption');
  }
  get tags() {
    return this.formGroup.get('tags');
  }

  async ngOnInit() {
    await this.getQuestion({
      page: this.page,
      limit: this.limit
    });

    this.getUserDetails = await this.commonservice.getTokenDetails('id');
  }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  rightOption(option: any) {
    this.selectedOption = option;
  }

  async getQuestion(params: any) {
    await this.commonservice.put(params, 'questions/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.questions = apiResult && apiResult.payload;

      if (apiResult && apiResult.status == 'SUCCESS') {
        this.questions = apiResult && apiResult.payload;
        this.questions.map((question: any) => { });
      } else {
        this.errFlag = true;
        this.errMessage = apiResult.msg;
      }
    });
  }
  async onSubmit(formData: any) {
    this.options = [];
    const tags = formData['tags'] && formData['tags'].split(',').filter((tag: any) => tag);
    let rightAnswer = '';
    if (this.selectedOption == 'option1') {
      rightAnswer = this.formGroup.value['option1'];
    } else if (this.selectedOption == 'option2') {
      rightAnswer = this.formGroup.value['option2'];
    } else if (this.selectedOption == 'option3') {
      rightAnswer = this.formGroup.value['option3'];
    } else if (this.selectedOption == 'option4') {
      rightAnswer = this.formGroup.value['option4'];
    }

    for (let index = 1; index < 5; index++) {
      this.options.push(this.formGroup.value[`option${index}`]);
    }

    await this.commonservice
      .post(
        {
          question: this.updateDesc,
          options: this.options,
          rightoption: rightAnswer,
          point: this.formGroup.value.point,
          level: this.formGroup.value.level,
          questiontype: this.formGroup.value.questiontype,
          user_id: this.getUserDetails,
          tags: tags
        },
        'questions/add'
      )
      .subscribe((res) => {
        const apiResult = JSON.parse(JSON.stringify(res));

        if (apiResult && apiResult.status == 'SUCCESS') {
          tags.map(async (tag: string) => {
            await this.commonservice
              .post(
                {
                  name: tag,
                  type: 'question',
                  question_id: apiResult?.payload?._id,
                },
                'tags/add'
              )
              .subscribe((res: any) => { });
          });
          this.formGroup.reset();
          this.getUserDetails = '';
          this.updateDesc = '';
          this.editorData = 'Enter text';
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
      });
  }

  addOptions() {
    this.count++;
    if (this.count < 5) {
      const p: HTMLParagraphElement = this.renderer.createElement('p');
      p.innerHTML = `<div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
        <input type="radio" formControlName="rightoption" aria-label="Radio button for following text input">
        </div>
      </div>
      <input type="text" formControlName="options" class="form-control" aria-label="Text input with radio button">
    </div>`;
      this.renderer.appendChild(this.div.nativeElement, p);
    }
  }
}
