import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackendModalComponent } from './backend-modal';

describe('BackendModalComponent', () => {
  let component: BackendModalComponent;
  let fixture: ComponentFixture<BackendModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackendModalComponent);
    component = fixture.componentInstance;

    // Mock backend data for testing
    component.backend = {
      id: '1',
      name: 'Test Backend',
      description: 'Test Description',
      version: 'v1.0.0',
      environment: 'Production',
      status: 'Healthy',
      uptime: '99.9%',
      apis: 5,
      tags: ['test', 'api'],
      features: ['Feature 1', 'Feature 2'],
      lastUpdate: new Date()
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onClose when close is called', () => {
    spyOn(component.onClose, 'emit');
    component.close();
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should return correct status class', () => {
    component.backend.status = 'Healthy';
    expect(component.getStatusClass()).toBe('status-healthy');
    
    component.backend.status = 'Warning';
    expect(component.getStatusClass()).toBe('status-warning');
    
    component.backend.status = 'Error';
    expect(component.getStatusClass()).toBe('status-error');
  });

  it('should return correct environment class', () => {
    component.backend.environment = 'Production';
    expect(component.getEnvironmentClass()).toBe('env-production');
    
    component.backend.environment = 'Staging';
    expect(component.getEnvironmentClass()).toBe('env-staging');
    
    component.backend.environment = 'Development';
    expect(component.getEnvironmentClass()).toBe('env-development');
  });
});