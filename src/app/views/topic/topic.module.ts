import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxPaginationModule } from 'ngx-pagination';


import {
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  PaginationModule,
  SharedModule
} from '@coreui/angular';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';
import { AddTopicComponent } from './add-topic/add-topic.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { EditTopic } from './edit-topic/edit-topic.component';
// import { PaginationModule } from '@coreui/angular';

@NgModule({
  declarations: [
    TopicListComponent,
    AddTopicComponent,
    EditTopic
  ],
  imports: [
    CommonModule,
    TopicRoutingModule,
    PaginationModule,
    // NgxPaginationModule,
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
export class TopicModule {
}