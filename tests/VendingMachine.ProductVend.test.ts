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
  productStore = new ProductStore([new Product("Cola", 100), new Product("Chips", 50), new Product("Candy", 65)]);
  vendingMachine = new VendingMachine(display, coinValuation, productStore);
});

describe('given cola product selected and no coins inserted', function () {
  it('displays "PRICE" message', function () {
    vendingMachine.vend("Cola");
    expect(Message.Price).equals(display.CurrentMessage);
  });
});


describe('given cola product selected and wrong amount inserted', function () {
  it('displays "PRICE" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Cola");
    expect(Message.Price).equals(display.CurrentMessage);
  });
});

describe('given cola product selected and right amount inserted', function () {
  it('displays "THANK YOU" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Cola");
    expect(Message.Thank).equals(display.CurrentMessage);
  });
});

describe('given cola product selected and right amount inserted vend pressed again', function () {
  it('displays "PRICE" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Cola");
    vendingMachine.vend("Cola");
    expect(Message.Price).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect(Message.NoCoin).equals(display.CurrentMessage);
  });
});

describe('given cola product selected and extra amount inserted', function () {
  it('displays "THANK YOU" message and displays amount left', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Cola");
    expect(Message.Thank).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect("$0.25").equals(display.CurrentMessage);
    var changeValue = coinValuation.getValueInCents(vendingMachine.getChange()[0]);    
    expect(changeValue).equals(25);
  });
});

describe('given chips product selected and right amount inserted', function () {
  it('displays "THANK YOU" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Chips");
    expect(Message.Thank).equals(display.CurrentMessage);
  });
});

describe('given candy product selected', function () {
  it('displays "THANK YOU" then "$0.10" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Candy");
    expect(Message.Thank).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect("$0.10").equals(display.CurrentMessage);
  });
});

describe('given invalid product selected', function () {
  it('displays "$0.50" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("INVALID");
    expect("$0.50").equals(display.CurrentMessage);
  });
});