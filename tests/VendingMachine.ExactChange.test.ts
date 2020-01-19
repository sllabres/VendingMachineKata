import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { Messages } from "../src/Messages";
import { CoinValuationMachine } from "../src/CoinValuationMachine";
import { ChangeMachine } from "../src/ChangeMachine";
import { Coin } from "../src/Coin";
import { ProductDispneserFake } from "./ProductDispneserFake";

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
  var quater: Coin = new Coin(5, 24, 25);
  var dime: Coin = new Coin(5, 21, 10);
  var nickel: Coin = new Coin(2.2, 17, 5);
  display = new DisplayFake();
  coinMachine = new CoinValuationMachine([quater, nickel, dime]);
  vendingMachine = new VendingMachine(display, coinMachine, new ProductStore([new Product("ABC", 30, 1)]), new ChangeMachine([new Coin(5, 24, 25)]), new ProductDispneserFake());
});

describe('given only quarters in change given and product is 30 cents', function () {
  it('then displays "EXACT CHANGE" message', function () {
    vendingMachine.refreshDisplay();
    expect(Messages.ExactChange).equals(display.CurrentMessage);
  });
});