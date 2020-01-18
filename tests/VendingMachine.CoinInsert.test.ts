import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { Message } from "../src/Message";
import { CoinMachine } from "../src/CoinValuationMachine";
import { Disc } from "../src/Disc";

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var display: DisplayFake;
var coinValuation: CoinMachine;
var vendingMachine: VendingMachine;

beforeEach(function () {
  display = new DisplayFake();
  coinValuation = new CoinMachine();  
  vendingMachine = new VendingMachine(display, coinValuation, new ProductStore([]));
});

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.refreshDisplay();
    expect(Message.NoCoin).equals(display.CurrentMessage);
  });
});

describe('given nickel inserted', function () {
  it('displays "$0.05" message', function () {
    coinValuation.getCoinByValue(5, (c) => {
      vendingMachine.insertCoin(c);
    });
    expect("$0.05").equals(display.CurrentMessage);
  });
});

describe('given dime inserted', function () {
  it('displays "$0.10" message', function () {
    coinValuation.getCoinByValue(10, (c) => {
      vendingMachine.insertCoin(c);
    });
    expect("$0.10").equals(display.CurrentMessage);
  });
});

describe('given quarter inserted', function () {
  it('displays "$0.25" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
    });
    expect("$0.25").equals(display.CurrentMessage);
  });
});

describe('given two quarters inserted', function () {
  it('displays "$0.50" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });
    expect("$0.50").equals(display.CurrentMessage);
  });
});

describe('given quarter and dime inserted', function () {
  it('displays "$0.35" message', function () {

    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
    });

    coinValuation.getCoinByValue(10, (c) => {
      vendingMachine.insertCoin(c);
    });

    expect("$0.35").equals(display.CurrentMessage);
  });
});

describe('given invalid coin inserted', function () {
  it('displays "INSERT COIN" message and gives change', function () {
    var coinToInsert = new Disc(0, 0);
    vendingMachine.insertCoin(coinToInsert);
    var change = vendingMachine.getChange();
    vendingMachine.refreshDisplay();
    expect(Message.NoCoin).equals(display.CurrentMessage);
    expect(1).equals(change.length);
  });
});

describe('given quarter and then invalid coin inserted', function () {
  it('displays "INSERT COIN" message and gives change', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
    });

    vendingMachine.insertCoin(new Disc(0, 0));
    var change = vendingMachine.getChange();
    expect("$0.25").equals(display.CurrentMessage);
    expect(2).equals(change.length);
  });
});