import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTopic } from './edit-topic.component';

describe('EditTopicComponent', () => {
  let component: EditTopic;
  let fixture: ComponentFixture<EditTopic>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTopic],
    });
    fixture = TestBed.createComponent(EditTopic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
