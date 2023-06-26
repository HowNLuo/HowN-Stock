import { TestBed } from '@angular/core/testing';

import { ShareholdingService } from './shareholding.service';

describe('ShareholdingService', () => {
  let service: ShareholdingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareholdingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
