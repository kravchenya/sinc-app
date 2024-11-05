import { TestBed } from '@angular/core/testing';

import { PersistenceSettingService } from './persistence-setting.service';

describe('PersistenceSettingService', () => {
  let service: PersistenceSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersistenceSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
