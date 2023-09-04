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
  AccordionModule,
  NavModule, 
  TabsModule,
  PaginationModule,
  SharedModule
} from '@coreui/angular';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';
import { AddTopicComponent } from './add-topic/add-topic.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { EditTopic } from './edit-topic/edit-topic.component';
import { RelationComponent } from './relation/relation.component';

@NgModule({
  declarations: [
    TopicListComponent,
    AddTopicComponent,
    RelationComponent,
    EditTopic
  ],
  imports: [
    CommonModule,
    TopicRoutingModule,
    // DocsComponentsModule,
    PaginationModule,
    AccordionModule,
    NavModule, 
    TabsModule,
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