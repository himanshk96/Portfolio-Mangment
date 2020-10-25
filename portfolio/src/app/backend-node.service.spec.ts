import { TestBed } from '@angular/core/testing';

import { BackendNodeService } from './backend-node.service';

describe('BackendNodeService', () => {
  let service: BackendNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
