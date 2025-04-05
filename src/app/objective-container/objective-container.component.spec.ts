import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveContainerComponent } from './objective-container.component';

describe('ObjectiveContainerComponent', () => {
  let component: ObjectiveContainerComponent;
  let fixture: ComponentFixture<ObjectiveContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectiveContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectiveContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
