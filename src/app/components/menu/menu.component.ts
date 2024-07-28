import { Component } from '@angular/core';
import { MenuService } from '../../utils/services/menu.service';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { Category } from '../../utils/models/category';
import { Store } from '../../utils/models/store';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  stores: Store[] = [];
  selectedStoreId: string | null = null;
  errorMessage: string | null = null;
  currentRoute: string;

  constructor(
    private menuService: MenuService,
    private router: Router
  ) { 
    this.currentRoute = '';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        localStorage.setItem('currentRoute', this.currentRoute);
      }
    });
  }

  ngOnInit(): void {
    this.loadStores();
    this.selectedStoreId = this.menuService.getStoreIdFromLocalStorage() || '';
    const savedRoute = localStorage.getItem('currentRoute');
    if (savedRoute) {
      this.router.navigate([savedRoute]);
    }
  }

  loadStores(): void {
    this.menuService.getStores().pipe(
      catchError(error => {
        this.errorMessage = 'Error loading stores';
        console.error('Error loading stores:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.stores = data;
    });
  }

  onStoreChange(event: any): void {
    const storeId = event.target.value;
    this.selectedStoreId = storeId;
    this.menuService.setSelectedStoreId(storeId);
  }
}