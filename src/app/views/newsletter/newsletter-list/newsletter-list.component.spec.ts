import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterListComponent } from './newsletter-list.component';

describe('BlogListComponent', () => {
  let component: NewsletterListComponent;
  let fixture: ComponentFixture<NewsletterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsletterListComponent]
    });
    fixture = TestBed.createComponent(NewsletterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
