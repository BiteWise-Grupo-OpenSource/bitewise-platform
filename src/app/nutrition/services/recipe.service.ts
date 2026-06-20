import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../../shared/services/api-url.service';
import { Recipe, CreateRecipeRequest } from '../../shared/model/api.models';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  getAllRecipes(query?: string): Observable<Recipe[]> {
    const url = query
      ? this.apiUrl.endpoint(`recipes?q=${encodeURIComponent(query)}`)
      : this.apiUrl.endpoint('recipes');
    return this.http.get<Recipe[]>(url);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(this.apiUrl.endpoint(`recipes/${id}`));
  }

  createRecipe(request: CreateRecipeRequest): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl.endpoint('recipes'), request);
  }
}
