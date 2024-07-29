import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsByStoreUrl = 'http://localhost:8080/api/products/stores';
  private updateProductUrl = 'http://localhost:8080/api/products';
  private deleteProductUrl = 'http://localhost:8080/api/products'; // URL base para eliminar productos
  private productsWithVariationsUrl = 'http://localhost:8080/api/products/with-variations';
  private productVariationsUrl = 'http://localhost:8080/api/products';
  private createOptionUrl = 'http://localhost:8080/api/products/options';
  private createCharacteristicUrl = 'http://localhost:8080/api/products/characteristics';


  constructor(private http: HttpClient) { }

  getProductsByStore(storeId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productsByStoreUrl}/${storeId}`);
  }

  deleteProduct(productId: number): Observable<void> {
    const url = `${this.deleteProductUrl}/${productId}`;
    return this.http.delete<void>(url);
  }

  getProductsWithVariations(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsWithVariationsUrl);
  }

  getProductVariations(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.productVariationsUrl}/${productId}/variations`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productVariationsUrl}/categories/${categoryId}`);
  }

  createOption(option: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.createOptionUrl, option, { headers });
  }

  createCharacteristic(characteristic: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.createCharacteristicUrl, characteristic, { headers });
  }

  createProductVariation(productId: number, variation: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.productVariationsUrl}/${productId}/variations`, variation, { headers });
  }
  updateProduct(product: Product): Observable<Product> {
    const url = `${this.updateProductUrl}/${product.id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      name: product.name,
      description: product.description,
      imgUrl: product.imgUrl,
      displayOrder: product.displayOrder,
      isEnabled: product.isEnabled,
      isUpSelling: product.isUpSelling,
      storeId: product.store.id,  // Asegurar que el storeId esté incluido
      categoryId: product.category.id  // Asegurar que el categoryId esté incluido
    };
    return this.http.patch<Product>(url, body, { headers });
  }

  createProduct(product: Partial<Product>): Observable<Product> { // Partial<Product> para permitir la omisión de algunas propiedades opcionales
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Product>(this.updateProductUrl, product, { headers });
  }
}