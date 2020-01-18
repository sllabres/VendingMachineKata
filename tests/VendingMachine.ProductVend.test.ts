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
var quater: Coin = new Coin(5, 24, 25);
var dime: Coin = new Coin(5, 21, 10);
var nickel: Coin = new Coin(2.2, 17, 5);

beforeEach(function () {
  display = new DisplayFake();
  var coins = [quater, nickel, dime];
  coinMachine = new CoinValuationMachine(coins);  
  productStore = new ProductStore([new Product("Cola", 100, 10), new Product("Chips", 50, 10), new Product("Candy", 65, 10)]);
  vendingMachine = new VendingMachine(display, coinMachine, productStore, new ChangeMachine(coins));
});

describe('given cola product selected and no coins inserted', function () {
  it('displays "PRICE" message', function () {
    vendingMachine.vend("Cola");
    expect(Messages.Price).equals(display.CurrentMessage);
  });
});


describe('given cola product selected and wrong amount inserted', function () {
  it('displays "PRICE" message', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.vend("Cola");
    expect(Messages.Price).equals(display.CurrentMessage);
  });
});

describe('given cola product selected and right amount inserted', function () {
  it('displays "THANK YOU" message', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);

    vendingMachine.vend("Cola");
    expect(Messages.Thank).equals(display.CurrentMessage);
  });
});

describe('given cola product selected and right amount inserted vend pressed again', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);

    vendingMachine.vend("Cola");
    vendingMachine.vend("Cola");
    expect(Messages.Price).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect(Messages.InsertCoin).equals(display.CurrentMessage);
  });
});

describe('given cola product selected and extra amount inserted', function () {
  it('displays "THANK YOU" message and displays amount left', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);

    vendingMachine.vend("Cola");
    expect(Messages.Thank).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect("$0.25").equals(display.CurrentMessage);
    var changeValue = coinMachine.getValueInCents(vendingMachine.getChange()[0]);
    expect(changeValue).equals(25);
  });
});

describe('given chips product selected and right amount inserted', function () {
  it('displays "THANK YOU" message', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);    

    vendingMachine.vend("Chips");
    expect(Messages.Thank).equals(display.CurrentMessage);
  });
});

describe('given candy product selected', function () {
  it('displays "THANK YOU" then "$0.10" message', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);    

    vendingMachine.vend("Candy");
    expect(Messages.Thank).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect("$0.10").equals(display.CurrentMessage);
  });
});

describe('given invalid product selected', function () {
  it('displays "$0.50" message', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);

    vendingMachine.vend("INVALID");
    expect("$0.50").equals(display.CurrentMessage);
  });
});