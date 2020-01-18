import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { Message } from "../src/Message";
import { CoinMachine } from "../src/CoinValuationMachine";

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var display: DisplayFake;
var coinValuation: CoinMachine;
var productStore: ProductStore;
var vendingMachine: VendingMachine;

beforeEach(function () {
  display = new DisplayFake();
  coinValuation = new CoinMachine();
  productStore = new ProductStore([new Product("Cola", 100, 1), new Product("Chips", 50, 0), new Product("Candy", 65, 1)]);
  vendingMachine = new VendingMachine(display, coinValuation, productStore);
});

describe('given chips product selected and sold out', function () {
  it('displays "SOLD OUT" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Chips");
    expect("SOLD OUT").equals(display.CurrentMessage);
  });
});