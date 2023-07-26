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

import { InnerRoutingModule } from './inner-routing.module';
import { TopicComponent } from './topic/topic.component';
import { AddTopicComponent } from './add-topic/add-topic.component';


@NgModule({
  declarations: [
    TopicComponent,
    AddTopicComponent
  ],
  imports: [
    CommonModule,
    InnerRoutingModule,
    // DocsComponentsModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    DropdownModule,
    SharedModule,
    ListGroupModule
  ]
})
export class InnerModule {
}
