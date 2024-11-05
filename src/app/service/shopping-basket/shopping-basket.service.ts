import { BehaviorSubject } from 'rxjs';

export class ShoppingBasketService {
  constructor() {}

  private basketItems = new BehaviorSubject<any[]>([]);
  basketItems$ = this.basketItems.asObservable();

  addProducts(products: any[]) {
    const currentItems = this.basketItems.getValue();
    const newItems = [...currentItems, ...products];
    this.basketItems.next(newItems);
  }

  removeProduct(productId: number) {
    const currentItems = this.basketItems.getValue();
    const updatedItems = currentItems.filter((item) => item.id !== productId);
    this.basketItems.next(updatedItems);
  }

  clearBasket() {
    this.basketItems.next([]);
  }

  getBasketCount() {
    return this.basketItems.getValue().length;
  }

  getTotal() {
    return this.basketItems
      .getValue()
      .reduce((total, item) => total + item.price, 0);
  }
}
