import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { Messages } from "../src/Messages";
import { CoinValuationMachine } from "../src/CoinValuationMachine";
import { ChangeMachine } from "../src/ChangeMachine";
import { Coin } from "../src/Coin";
import { Disc } from "../src/Disc";

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var display: DisplayFake;
var coinMachine: CoinValuationMachine;
var productStore: ProductStore;
var vendingMachine: VendingMachine;
var quater: Disc;

beforeEach(function () {
  display = new DisplayFake();
  var coins = [new Coin(5, 24, 25), new Coin(5, 21, 5), new Coin(2.2, 17, 10)];
  coinMachine = new CoinValuationMachine(coins);
  quater = coinMachine.getCoinByValue(25);
  productStore = new ProductStore([new Product("Cola", 100, 1), new Product("Chips", 50, 0), new Product("Candy", 50, 1)]);
  vendingMachine = new VendingMachine(display, coinMachine, productStore, new ChangeMachine(coins));
});

describe('given chips product selected and sold out', function () {
  it('displays "SOLD OUT" message', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.vend("Chips");
    expect(Messages.SoldOut).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect("$0.50").equals(display.CurrentMessage);
    vendingMachine.getChange();
    vendingMachine.refreshDisplay();
    expect(Messages.InsertCoin).equals(display.CurrentMessage);
  });
});

describe('given candy product with limited stock', function () {
  it('displays "SOLD OUT" message after first purchase', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.vend("Candy");
    vendingMachine.vend("Candy");
    expect(display.CurrentMessage).equals(Messages.SoldOut);
  });
});