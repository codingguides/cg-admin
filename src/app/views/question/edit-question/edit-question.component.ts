import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { async } from 'rxjs';
import { HttpCallService } from 'src/app/common/http-call.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss'],
})
export class EditQuestionComponent {
  public favoriteColor = '#26ab3c';
  updateDesc: any = '';
  ansDetails: any = '';
  formGroup!: FormGroup;
  questions!: any[];
  questionSlug: string = '';
  getUserDetails: any;
  @ViewChild('div')
  div!: ElementRef;
  count: any = 0;
  options: any[] = [];
  selectedOption: any = '';
  questionByID: any = {};
  config: any;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
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
      rightAnswerDescription: new FormControl(''),
    });
  }

  public onTagEdited(event: any) {
    console.log('tag edited: current value is ' + event);
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
  get rightAnswerDescription() {
    return this.formGroup.get('rightAnswerDescription');
  }

  async ngOnInit() {
    await this.getId();

    this.getUserDetails = await this.commonservice.getTokenDetails('id');
  }

  async getId() {
    await this.commonservice
      .get(`questions/get/${this.router.snapshot.params['id']}`)
      .subscribe(async (result: any) => {
        if (result && result.status == 'SUCCESS') {
          this.questionByID = result && result.payload;
          this.updateDesc = this.questionByID.question;
          this.ansDetails = this.questionByID.rightAnswerDescription;
          // await this.getQuestion(this.questionByID._id);

          this.formGroup = this.formBuilder.group({
            question: new FormControl(this.questionByID.question),
            rightAnswerDescription: new FormControl(this.questionByID.rightAnswerDescription),

            questiontype: new FormControl(this.questionByID.questiontype),
            point: new FormControl(this.questionByID.point),
            level: new FormControl(this.questionByID.level),

            option1: new FormControl(this.questionByID.options[0].toString()),
            option2: new FormControl(this.questionByID.options[1].toString()),
            option3: new FormControl(this.questionByID.options[2].toString()),
            option4: new FormControl(this.questionByID.options[3].toString()),
            rightoption: new FormControl(
              this.questionByID.rightoption.toString()
            ),
          });
        }
      });
  }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  ansDescription(event: CKEditor4.EventInfo) {
    this.ansDetails = event.editor.getData();
  }

  rightOption(option: any) {
    this.questionByID.rightoption = '';
    this.selectedOption = option;
  }



  async onSubmit(formData: any) {
    this.options = [];
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
    else {
      rightAnswer = this.questionByID.rightoption;
    }

    for (let index = 1; index < 5; index++) {
      this.options.push(this.formGroup.value[`option${index}`]);
    }

    await this.commonservice
      .put(
        {
          question: this.updateDesc,
          options: this.options,
          rightoption: rightAnswer,
          point: this.formGroup.value.point,
          level: this.formGroup.value.level,
          questiontype: this.formGroup.value.questiontype,
          user_id: this.getUserDetails,
          rightAnswerDescription: this.ansDetails,
        },
        `questions/update/${this.router.snapshot.params['id']}`
      )
      .subscribe((res) => {
        const apiResult = JSON.parse(JSON.stringify(res));

        if (apiResult && apiResult.status == 'SUCCESS') {
          this.formGroup.reset();
          this.getUserDetails = '';
          this.ansDetails = '';
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

  isChecked(option: any) {
    return this.questionByID.rightoption === option.value ? true : false;
  }
}
