import { expect } from "chai";

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.vend();
    expect(Message.NoCoin).equals(display.CurrentMessage);
  });
});

describe('given nickel inserted', function () {
  it('displays "$0.05" message', function () {
    var coinToInsert = new Disc(5, 21);
    vendingMachine.insertCoin(coinToInsert);
    vendingMachine.vend();
    expect("$0.05").equals(display.CurrentMessage);
  });
});

describe('given dime inserted', function () {
  it('displays "$0.10" message', function () {
    var coinToInsert = new Disc(2.2, 17);
    vendingMachine.insertCoin(coinToInsert);
    vendingMachine.vend();
    expect("$0.10").equals(display.CurrentMessage);
  });
});

describe('given quarter inserted', function () {
  it('displays "$0.25" message', function () {
    var coinToInsert = new Disc(5, 24);
    vendingMachine.insertCoin(coinToInsert);
    vendingMachine.vend();
    expect("$0.25").equals(display.CurrentMessage);
  });
});

describe('given two quarters inserted', function () {
  it('displays "$0.50" message', function () {
    var coinToInsert = new Disc(5, 24);
    vendingMachine.insertCoin(coinToInsert);
    vendingMachine.insertCoin(coinToInsert);
    vendingMachine.vend();
    expect("$0.50").equals(display.CurrentMessage);
  });
});

describe('given invalid coin inserted', function () {
  it('displays "INSERT COIN" message and gives change', function () {
    var coinToInsert = new Disc(0, 0);
    vendingMachine.insertCoin(coinToInsert);
    vendingMachine.vend();
    var change = vendingMachine.getChange();
    expect(Message.NoCoin).equals(display.CurrentMessage);
    expect(1).equals(change.length);
  });
});

enum Message {
  NoCoin = "INSERT COIN"
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

class CoinSpecification {
  readonly weightInGrams: number;
  readonly diameterInMillimeters: number;
  readonly valueInCents: number;

  constructor(weightInGrams: number, diameterInMillimeters: number, valueInCents: number) {
    this.weightInGrams = weightInGrams;
    this.diameterInMillimeters = diameterInMillimeters;
    this.valueInCents = valueInCents;
  }
}

class CoinValuationMachine {
  readonly coinTypes: Array<CoinSpecification>;
  constructor() {
    this.coinTypes = [new CoinSpecification(5, 24, 25), new CoinSpecification(5, 21, 5), new CoinSpecification(2.2, 17, 10)];
  }

  public getValueInCentsByCoin(disc: Disc): number {
    return this.coinTypes.filter(ct => ct.diameterInMillimeters == disc.diameterInMillimeters && ct.weightInGrams == disc.weightInGrams)[0]?.valueInCents ?? 0;
  }
}

class VendingMachine {
  private readonly display: IDisplay;
  private readonly coinMachine: CoinValuationMachine;
  private runningTotal: number;
  private ejectedCoins: Array<Disc>;

  constructor(display: IDisplay) {
    this.display = display;
    this.coinMachine = new CoinValuationMachine();
    this.runningTotal = 0;
    this.ejectedCoins = [];
  }

  public vend(): void {
    this.runningTotal = 0;
  }

  public getChange(): Array<Disc> {
    return this.ejectedCoins;
  }

  public insertCoin(disc: Disc): void {
    var coinValue = this.coinMachine.getValueInCentsByCoin(disc);
    this.runningTotal += coinValue;
    if (coinValue > 0)
      this.display.update(DollarCurrencyFormat.Format(this.runningTotal));
    else {
      this.ejectedCoins.push(disc);
      this.display.update(Message.NoCoin);
    }
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
var vendingMachine = new VendingMachine(display);