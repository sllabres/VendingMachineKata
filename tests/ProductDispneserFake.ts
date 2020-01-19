import { IProductDispenser as IProductDispenser } from "../src/VendingMachine";
import { Product, NullProduct } from "../src/ProductStore";
export class ProductDispneserFake implements IProductDispenser {
  public product: Product = new NullProduct();
  dispense(product: Product): void {
    this.product = product;
  }
}
