import { expect } from "chai";

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.vend();
    expect(Message.NoCoin).equals(displayFake.CurrentMessage);
  });
});

describe('given dime inserted', function () {
  it('displays "$0.10" message', function () {
    var coinToInsert = new Coin(2.2, 1.95);
    vendingMachine.insertCoin(coinToInsert);
    var coinValue = new CoinValuationMachine().getValueInCentsByCoin(coinToInsert);
    expect(DollarCurrencyFormat.Format(coinValue)).equals(displayFake.CurrentMessage);
  });
});

describe('given nickel inserted', function () {
  it('displays "$0.05" message', function () {
    var coinToInsert = new Coin(5, 1.95);
    vendingMachine.insertCoin(coinToInsert);
    var coinValue = new CoinValuationMachine().getValueInCentsByCoin(coinToInsert);
    expect(DollarCurrencyFormat.Format(coinValue)).equals(displayFake.CurrentMessage);
  });
});

enum Message {
  NoCoin = "INSERT COIN"
}

class DollarCurrencyFormat {
  public static Format(valueInCents: number) : string{
    return `\$${(valueInCents / 100).toFixed(2)}`;
  }
}

class Coin {
  readonly weightInGrams: number;
  readonly sizeInMillimeters: number;

  constructor(weightInGrams: number, sizeInMillimeters: number) {
    this.weightInGrams = weightInGrams;
    this.sizeInMillimeters = sizeInMillimeters;
  }
}

class CoinValuationMachine {
  public getValueInCentsByCoin(coin: Coin): number {
    if (coin.weightInGrams == 5)
      return 5;
    else
      return 10;
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

  public insertCoin(coin: Coin): void {
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