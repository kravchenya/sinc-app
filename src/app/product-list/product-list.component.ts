import { Component, OnInit, ViewChild } from '@angular/core';
import { FakeStoreService } from '../service/fake-store/fake-store.service';
import { Product } from '../service/product';
import { CommonModule } from '@angular/common';

import {
  MatTableModule,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { SelectionModel } from '@angular/cdk/collections';
import { ShoppingBasketService } from '../service/shopping-basket/shopping-basket.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { PersistenceSettingService } from '../service/persistence/persistence-setting.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  loading: boolean = false;
  error: string = '';

  categories: string[] = [];
  selectedCategory: string = '';

  originalData: Product[] = [];

  selection = new SelectionModel<Product>(true, []);

  displayedColumns: string[] = [
    'select',
    'title',
    'description',
    'price',
    'category',
    'rating',
  ];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Product>;

  constructor(
    private fakeStoreService: FakeStoreService,
    private basketService: ShoppingBasketService,
    private filterPersistence: PersistenceSettingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.loadSavedFilters();
  }

  private saveFilters() {
    this.filterPersistence.saveFilters({
      category: this.selectedCategory,
      searchTerm: this.dataSource.filter,
    });
  }

  private loadSavedFilters() {
    const savedFilters = this.filterPersistence.loadFilters();
    if (savedFilters) {
      this.selectedCategory = savedFilters.category;
      // this.filterByCategory();

      if (savedFilters.searchTerm) {
        this.applyFilter({ target: { value: savedFilters.searchTerm } } as any);
      }
    }
  }

  private loadProducts() {
    this.loading = true;
    this.fakeStoreService.getProducts().subscribe({
      next: (data) => {
        this.loading = false;

        this.originalData = data;

        this.dataSource.data = data;
        this.categories = [...new Set(data.map((product) => product.category))];

        this.filterByCategory();

        this.table?.renderRows();
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      },
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  addToBasket() {
    const selectedProducts = this.selection.selected;
    console.log('Adding to basket:', selectedProducts);
    // Here you would typically dispatch to a service/store
    this.basketService.addProducts(selectedProducts);
    // Clear selection after adding to basket
    this.selection.clear();
  }

  filterByCategory() {
    if (!this.selectedCategory) {
      this.dataSource.data = this.originalData;
    } else {
      this.dataSource.data = this.originalData.filter(
        (product) => product.category === this.selectedCategory
      );
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.saveFilters();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    // First filter by category
    let filteredData = this.selectedCategory
      ? this.originalData.filter(
          (product) => product.category === this.selectedCategory
        )
      : this.originalData;

    // Then apply search filter
    if (filterValue) {
      filteredData = filteredData.filter(
        (product) =>
          product.title.toLowerCase().includes(filterValue) ||
          product.description.toLowerCase().includes(filterValue) ||
          product.category.toLowerCase().includes(filterValue)
      );
    }

    this.dataSource.data = filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClick(product: any) {
    this.router.navigate(['/product', product.id]);
  }
}
