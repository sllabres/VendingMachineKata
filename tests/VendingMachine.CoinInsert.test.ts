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
  vendingMachine = new VendingMachine(display, coinMachine, new ProductStore([]), new ChangeMachine([new Coin(5, 24, 25)]));
});

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.refreshDisplay();
    expect(Messages.InsertCoin).equals(display.CurrentMessage);
  });
});

describe('given nickel inserted', function () {
  it('displays "$0.05" message', function () {
    coinMachine.getCoinByValue(5, (c) => {
      vendingMachine.insertCoin(c);
    });
    expect("$0.05").equals(display.CurrentMessage);
  });
});

describe('given dime inserted', function () {
  it('displays "$0.10" message', function () {
    coinMachine.getCoinByValue(10, (c) => {
      vendingMachine.insertCoin(c);
    });
    expect("$0.10").equals(display.CurrentMessage);
  });
});

describe('given quarter inserted', function () {
  it('displays "$0.25" message', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
    });
    expect("$0.25").equals(display.CurrentMessage);
  });
});

describe('given two quarters inserted', function () {
  it('displays "$0.50" message', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });
    expect("$0.50").equals(display.CurrentMessage);
  });
});

describe('given quarter and dime inserted', function () {
  it('displays "$0.35" message', function () {

    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
    });

    coinMachine.getCoinByValue(10, (c) => {
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
    expect(Messages.InsertCoin).equals(display.CurrentMessage);
    expect(1).equals(change.length);
  });
});

describe('given quarter and then invalid coin inserted', function () {
  it('displays "INSERT COIN" message and gives change', function () {
    coinMachine.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
    });

    vendingMachine.insertCoin(new Disc(0, 0));
    var change = vendingMachine.getChange();
    expect("$0.25").equals(display.CurrentMessage);
    expect(2).equals(change.length);
  });
});