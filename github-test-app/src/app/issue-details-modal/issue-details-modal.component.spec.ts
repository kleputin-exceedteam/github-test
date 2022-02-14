import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDetailsModalComponent } from './issue-details-modal.component';

describe('IssueDetailsModalComponent', () => {
  let component: IssueDetailsModalComponent;
  let fixture: ComponentFixture<IssueDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
