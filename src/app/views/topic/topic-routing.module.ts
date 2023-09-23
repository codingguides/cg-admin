import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicListComponent } from './topic-list/topic-list.component';
import { AddTopicComponent } from './add-topic/add-topic.component';
import { EditTopic } from './edit-topic/edit-topic.component';
import { RelationComponent } from './relation/relation.component';

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
        path: 'edit/:id',
        component: EditTopic,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'relation/:id',
        component: RelationComponent,
        data: {
          title: 'Relation with topic and question'
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
