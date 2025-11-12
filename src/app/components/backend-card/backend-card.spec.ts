import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendCard } from './backend-card';

describe('BackendCard', () => {
  let component: BackendCard;
  let fixture: ComponentFixture<BackendCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackendCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
