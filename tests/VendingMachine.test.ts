import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { Message } from "../src/Message";
import { CoinValuationMachine } from "../src/CoinValuationMachine";
import { Disc } from "../src/Disc";

beforeEach(function () {
  display = new DisplayFake();
  vendingMachine = new VendingMachine(display, coinValuation);
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
    expect(1).equals(change.length);
  });
});

describe('given cola product selected and no coins inserted', function () {
  it('displays "PRICE" message', function () {
    vendingMachine.vend("Cola");
    expect("PRICE").equals(display.CurrentMessage);
  });
});


describe('given cola product selected and wrong amount inserted', function () {
  it('displays "PRICE" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Cola");
    expect("PRICE").equals(display.CurrentMessage);
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
    expect("THANK YOU").equals(display.CurrentMessage);
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
  });
});

describe('given chips product selected and right amount inserted', function () {
  it('displays "THANK YOU" message', function () {
    coinValuation.getCoinByValue(25, (c) => {
      vendingMachine.insertCoin(c);
      vendingMachine.insertCoin(c);
    });

    vendingMachine.vend("Chips");
    expect("THANK YOU").equals(display.CurrentMessage);
  });
});

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var display = new DisplayFake();
var coinValuation = new CoinValuationMachine();
var vendingMachine = new VendingMachine(display, coinValuation);