import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  SharedModule
} from '@coreui/angular';

import { InterviewRoutingModule } from './interview-routing.module';
import { InterviewListComponent } from './interview-list/interview-list.component';
import { AddInterviewComponent } from './add-interview/add-interview.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    InterviewListComponent,
    AddInterviewComponent
  ],
  imports: [
    CommonModule,
    InterviewRoutingModule,
    // DocsComponentsModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    DropdownModule,
    SharedModule,
    ListGroupModule
  ]
})
export class InterviewModule {
}