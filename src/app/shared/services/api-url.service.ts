import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiUrlService {
  readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  endpoint(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }
}
