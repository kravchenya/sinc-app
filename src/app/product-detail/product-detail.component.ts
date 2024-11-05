import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FakeStoreService } from '../service/fake-store/fake-store.service';
import { Product } from '../service/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  loading = true;
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private fakeStoreService: FakeStoreService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.fakeStoreService.getProduct(id).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.loading = false;
        },
      });
    });
  }
}
