import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicListComponent } from './topic-list/topic-list.component';
import { AddTopicComponent } from './add-topic/add-topic.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Topic'
    },
    children: [
      {
        path: 'list',
        component: TopicListComponent,
        data: {
          title: 'Topic List'
        }
      },
      {
        path: 'add',
        component: AddTopicComponent,
        data: {
          title: 'Add Topic'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TopicRoutingModule {
}
