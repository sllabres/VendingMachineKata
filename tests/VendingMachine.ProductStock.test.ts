import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { Message } from "../src/Message";
import { CoinMachine } from "../src/CoinValuationMachine";
import { Coin } from "../src/Coin";

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var display: DisplayFake;
var coinMachine: CoinMachine;
var productStore: ProductStore;
var vendingMachine: VendingMachine;

beforeEach(function () {
  display = new DisplayFake();
  coinMachine = new CoinMachine([new Coin(5, 24, 25), new Coin(5, 21, 5), new Coin(2.2, 17, 10)]);
  productStore = new ProductStore([new Product("Cola", 100, 1), new Product("Chips", 50, 0), new Product("Candy", 50, 1)]);
  vendingMachine = new VendingMachine(display, coinMachine, productStore);
});

describe('given chips product selected and sold out', function () {
  it('displays "SOLD OUT" message', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Chips");
    expect(Message.SoldOut).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect("$0.50").equals(display.CurrentMessage);
    vendingMachine.getChange();
    vendingMachine.refreshDisplay();
    expect(Message.InsertCoin).equals(display.CurrentMessage);
  });
});

describe('given candy product with limited stock', function () {
  it('displays "SOLD OUT" message after first purchase', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Candy");   
    vendingMachine.vend("Candy");    
    expect(display.CurrentMessage).equals(Message.SoldOut);
  });
});