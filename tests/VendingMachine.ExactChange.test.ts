import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { Messages } from "../src/Messages";
import { CoinValuationMachine } from "../src/CoinValuationMachine";
import { ChangeMachine } from "../src/ChangeMachine";
import { Disc } from "../src/Disc";
import { Coin } from "../src/Coin";

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var display: DisplayFake;
var coinMachine: CoinValuationMachine;
var vendingMachine: VendingMachine;

beforeEach(function () {
  display = new DisplayFake();
  coinMachine = new CoinValuationMachine([new Coin(5, 24, 25), new Coin(5, 21, 5), new Coin(2.2, 17, 10)]);  
  vendingMachine = new VendingMachine(display, coinMachine, new ProductStore([new Product("ABC", 30, 1)]), new ChangeMachine([new Coin(5, 24, 25)]));
});

describe('given only quarters in change given and product is 30 cents', function () {
  it('then displays "EXACT CHANGE" message', function () {
    vendingMachine.refreshDisplay();
    expect(Messages.ExactChange).equals(display.CurrentMessage);
  });
});