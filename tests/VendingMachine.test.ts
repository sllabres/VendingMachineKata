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
    var coinValue = new CoinValuationMachine().getValueInCentsByCoin(coinToInsert);
    expect("$0.05").equals(displayFake.CurrentMessage);
  });
});

describe('given dime inserted', function () {
  it('displays "$0.10" message', function () {
    var coinToInsert = new Disc(2.2, 17);
    vendingMachine.insertCoin(coinToInsert);
    var coinValue = new CoinValuationMachine().getValueInCentsByCoin(coinToInsert);
    expect("$0.10").equals(displayFake.CurrentMessage);
  });
});

describe('given quarter inserted', function () {
  it('displays "$0.25" message', function () {
    var coinToInsert = new Disc(5, 24);
    vendingMachine.insertCoin(coinToInsert);
    var coinValue = new CoinValuationMachine().getValueInCentsByCoin(coinToInsert);
    expect("$0.25").equals(displayFake.CurrentMessage);
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
  readonly sizeInMillimeters: number;

  constructor(weightInGrams: number, sizeInMillimeters: number) {
    this.weightInGrams = weightInGrams;
    this.sizeInMillimeters = sizeInMillimeters;
  }
}

class Coin {
  readonly weightInGrams: number;
  readonly sizeInMillimeters: number;
  readonly valueInCents: number;

  constructor(weightInGrams: number, sizeInMillimeters: number, valueInCents: number) {
    this.weightInGrams = weightInGrams;
    this.sizeInMillimeters = sizeInMillimeters;
    this.valueInCents = valueInCents;
  }
}

class CoinValuationMachine {
  readonly coinTypes: Array<Coin>;
  constructor() {
    this.coinTypes = [ new Coin(5,24, 25), new Coin(5,21, 5), new Coin(2.2,17, 10) ];
  }
  
  public getValueInCentsByCoin(coin: Disc): number {
    return this.coinTypes.filter(ct => ct.sizeInMillimeters == coin.sizeInMillimeters && ct.weightInGrams == coin.weightInGrams)[0].valueInCents;
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

  public insertCoin(coin: Disc): void {
    var coinValue = this.coinMachine.getValueInCentsByCoin(coin);
    this.display.update(DollarCurrencyFormat.Format(coinValue));
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