import { expect } from "chai";

beforeEach(function () {
  display = new DisplayFake();
  vendingMachine = new VendingMachine(display, coinValuation);
});

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
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
    expect("PRICE").equals(display.CurrentMessage);
  });
});

enum Message {
  NoCoin = "INSERT COIN",
  Price = "PRICE",
  Thank = "THANK YOU"
}

class DollarCurrencyFormat {
  public static Format(valueInCents: number): string {
    return `\$${(valueInCents / 100).toFixed(2)}`;
  }
}

class Disc {
  readonly weightInGrams: number;
  readonly diameterInMillimeters: number;

  constructor(weightInGrams: number, diameterInMillimeters: number) {
    this.weightInGrams = weightInGrams;
    this.diameterInMillimeters = diameterInMillimeters;
  }
}

class Coin extends Disc {
  readonly valueInCents: number;

  constructor(weightInGrams: number, diameterInMillimeters: number, valueInCents: number) {
    super(weightInGrams, diameterInMillimeters);
    this.valueInCents = valueInCents;
  }
}

class CoinValuationMachine {
  readonly coinTypes: Array<Coin>;
  constructor() {
    this.coinTypes = [new Coin(5, 24, 25), new Coin(5, 21, 5), new Coin(2.2, 17, 10)];
  }

  public getValueInCents(disc: Disc, onFound: (v: number) => void, onInvalid: (d: Disc) => void = () => { }): void {
    var value = this.coinTypes.filter(ct => ct.diameterInMillimeters == disc.diameterInMillimeters && ct.weightInGrams == disc.weightInGrams)[0]?.valueInCents ?? 0;
    if (value > 0)
      onFound(value)
    else
      onInvalid(disc);
  }

  public getCoinByValue(valueInCents: number, onCoinFound: (c: Coin) => void): void {
    var coin = this.coinTypes.filter(ct => ct.valueInCents == valueInCents)[0];
    if (coin)
      onCoinFound(coin);
  }
}

class VendingMachine {
  private readonly display: IDisplay;
  private readonly coinValuation: CoinValuationMachine;
  private runningTotal: number;
  private ejectedCoins: Array<Disc>;

  constructor(display: IDisplay, coinValuation: CoinValuationMachine) {
    this.display = display;
    this.coinValuation = coinValuation;
    this.runningTotal = 0;
    this.ejectedCoins = [];
  }

  public vend(selection: string): void {
    this.display.update(Message.Price);

    if (this.runningTotal == 100)
      this.display.update(Message.Thank);

    this.runningTotal = 0;
  }

  public getChange(): Array<Disc> {
    return this.ejectedCoins;
  }

  public insertCoin(disc: Disc): void {
    this.coinValuation.getValueInCents(disc, (v) => {
      this.runningTotal += v;
      this.display.update(DollarCurrencyFormat.Format(this.runningTotal));
    }, (d) => {
      this.ejectedCoins.push(d);
    });
  }
}

interface IDisplay {
  update(message: string): void;
}

class DisplayFake {
  public CurrentMessage: string = Message.NoCoin;
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var display = new DisplayFake();
var coinValuation = new CoinValuationMachine();
var vendingMachine = new VendingMachine(display, coinValuation);