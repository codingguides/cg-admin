import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogRelationComponent } from './blog-relation.component';

describe('BlogRelationComponent', () => {
  let component: BlogRelationComponent;
  let fixture: ComponentFixture<BlogRelationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogRelationComponent]
    });
    fixture = TestBed.createComponent(BlogRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
