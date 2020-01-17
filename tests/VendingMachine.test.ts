import { expect } from "chai";

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.vend();
    expect(Message.NoCoin).equals(displayFake.CurrentMessage);
  });
});

describe('given nickel inserted', function () {
  it('displays "$0.05" message', function () {
    var coinToInsert = new Disc(5, 21);
    vendingMachine.insertCoin(coinToInsert);
    expect("$0.05").equals(displayFake.CurrentMessage);
  });
});

describe('given dime inserted', function () {
  it('displays "$0.10" message', function () {
    var coinToInsert = new Disc(2.2, 17);
    vendingMachine.insertCoin(coinToInsert);
    expect("$0.10").equals(displayFake.CurrentMessage);
  });
});

describe('given quarter inserted', function () {
  it('displays "$0.25" message', function () {
    var coinToInsert = new Disc(5, 24);
    vendingMachine.insertCoin(coinToInsert);
    expect("$0.25").equals(displayFake.CurrentMessage);
  });
});

describe('given invalid coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    var coinToInsert = new Disc(0, 0);
    vendingMachine.insertCoin(coinToInsert);
    expect(Message.NoCoin).equals(displayFake.CurrentMessage);
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
  display: IDisplay;
  coinMachine: CoinValuationMachine;
  constructor(display: IDisplay) {
    this.display = display;
    this.coinMachine = new CoinValuationMachine();
  }

  public vend(): void {
    this.display.update(Message.NoCoin);
  }

  public insertCoin(disc: Disc): void {
    var coinValue = this.coinMachine.getValueInCentsByCoin(disc);
    if (coinValue > 0)
      this.display.update(DollarCurrencyFormat.Format(coinValue));
    else
      this.display.update(Message.NoCoin);
  }
}

interface IDisplay {
  update(message: string): void;
}

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var displayFake = new DisplayFake();
var vendingMachine = new VendingMachine(displayFake);