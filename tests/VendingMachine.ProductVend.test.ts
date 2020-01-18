import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { Messages } from "../src/Messages";
import { CoinValuationMachine } from "../src/CoinValuationMachine";
import { ChangeMachine } from "../src/ChangeMachine";
import { Coin } from "../src/Coin";

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

beforeEach(function () {
  display = new DisplayFake();  
  var coins = [new Coin(5, 24, 25), new Coin(5, 21, 5), new Coin(2.2, 17, 10)];
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
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Cola");
    expect(Messages.Price).equals(display.CurrentMessage);    
  });
});

describe('given cola product selected and right amount inserted', function () {
  it('displays "THANK YOU" message', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Cola");
    expect(Messages.Thank).equals(display.CurrentMessage);
  });
});

describe('given cola product selected and right amount inserted vend pressed again', function () {
  it('displays "INSERT COIN" message', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Cola");
    vendingMachine.vend("Cola");
    expect(Messages.Price).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect(Messages.InsertCoin).equals(display.CurrentMessage);
  });
});

describe('given cola product selected and extra amount inserted', function () {
  it('displays "THANK YOU" message and displays amount left', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

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
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Chips");
    expect(Messages.Thank).equals(display.CurrentMessage);
  });
});

describe('given candy product selected', function () {
  it('displays "THANK YOU" then "$0.10" message', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Candy");
    expect(Messages.Thank).equals(display.CurrentMessage);
    vendingMachine.refreshDisplay();
    expect("$0.10").equals(display.CurrentMessage);
  });
});

describe('given invalid product selected', function () {
  it('displays "$0.50" message', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("INVALID");
    expect("$0.50").equals(display.CurrentMessage);
  });
});