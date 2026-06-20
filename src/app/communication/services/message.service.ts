import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import { Message, CreateFoodLogRequest } from '../../shared/model/api.models';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl.endpoint('messages'));
  }
}
