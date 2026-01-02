import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateObjectiveComponent } from './create-objective.component';

describe('CreateObjectiveComponent', () => {
  let component: CreateObjectiveComponent;
  let fixture: ComponentFixture<CreateObjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateObjectiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
