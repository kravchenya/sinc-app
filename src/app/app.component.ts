import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ShoppingBasketService } from './service/shopping-basket/shopping-basket.service';
import { CommonModule } from '@angular/common';
import { PersistenceSettingService } from './service/persistence/persistence-setting.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ProductListComponent,

    CommonModule,

    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [ShoppingBasketService, PersistenceSettingService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'sinc-app';

  constructor(public basketService: ShoppingBasketService) {}
}
