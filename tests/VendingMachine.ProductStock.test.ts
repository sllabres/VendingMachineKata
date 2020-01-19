import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { Messages } from "../src/Messages";
import { CoinValuationMachine } from "../src/CoinValuationMachine";
import { ChangeMachine } from "../src/ChangeMachine";
import { Coin } from "../src/Coin";
import { DisplayFake } from "./DisplayFake";
import { ProductDispneserFake } from "./ProductDispneserFake";

var display: DisplayFake;
var coinMachine: CoinValuationMachine;
var productStore: ProductStore;
var vendingMachine: VendingMachine;
var productDispenser: ProductDispneserFake;
var quater: Coin = new Coin(5, 24, 25);
var dime: Coin = new Coin(5, 21, 10);
var nickel: Coin = new Coin(2.2, 17, 5);

beforeEach(function () {
  display = new DisplayFake();
  productDispenser = new ProductDispneserFake();
  var coins = [quater, nickel, dime];
  coinMachine = new CoinValuationMachine(coins);  
  productStore = new ProductStore([new Product("Cola", 100, 1), new Product("Chips", 50, 0), new Product("Candy", 50, 1)]);
  vendingMachine = new VendingMachine(display, coinMachine, productStore, new ChangeMachine(coins), productDispenser);
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
    expect(productDispenser.product.SKU).equals("Candy");
    vendingMachine.vend("Candy");
    expect(display.CurrentMessage).equals(Messages.SoldOut);
  });
});