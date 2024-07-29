import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private storesUrl = 'http://localhost:8080/api/stores';
  private categoriesUrl = 'http://localhost:8080/api/categories/store';
  private updateCategoryUrl = 'http://localhost:8080/api/categories';
  private selectedStoreIdSource = new BehaviorSubject<string | null>(this.getStoreIdFromLocalStorage());
  selectedStoreId$ = this.selectedStoreIdSource.asObservable();

  constructor(private http: HttpClient) { }

  getStores(): Observable<any> {
    return this.http.get<any>(this.storesUrl);
  }

  getCategories(storeId: string): Observable<any> {
    return this.http.get<any>(`${this.categoriesUrl}/${storeId}`);
  }

  updateCategory(category: Category): Observable<Category> {
    const url = `${this.updateCategoryUrl}/${category.id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Category>(url, category, { headers });
  }

  createCategory(category: Category): Observable<Category> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Category>(this.updateCategoryUrl, category, { headers });
  }

  deleteCategory(categoryId: number): Observable<void> {
    const url = `${this.updateCategoryUrl}/${categoryId}`;
    return this.http.delete<void>(url);
  }

  setSelectedStoreId(storeId: string | null): void {
    this.selectedStoreIdSource.next(storeId);
    if (storeId) {
      localStorage.setItem('selectedStoreId', storeId);
    } else {
      localStorage.removeItem('selectedStoreId');
    }
  }

  getStoreIdFromLocalStorage(): string | null {
    return localStorage.getItem('selectedStoreId');
  }

  
}