import { expect } from "chai";

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.vend();
    expect(Message.NoCoin).equals(displayFake.CurrentMessage);
  });
});

describe('given valid coin inserted', function () {

  it('displays "$0.10" message', function () {
    var coinToInsert = new Coin(2.2, 1.95);
    vendingMachine.insertCoin(coinToInsert);
    var coinValue = new CoinMachine().getValueInCentsByCoin(coinToInsert);
    expect(`\$${(coinValue / 100).toFixed(2)}`).equals(displayFake.CurrentMessage);
  });

  it('displays "$0.05" message', function () {
    var coinToInsert = new Coin(5, 1.95);
    vendingMachine.insertCoin(coinToInsert);
    var coinValue = new CoinMachine().getValueInCentsByCoin(coinToInsert);
    expect(`\$${(coinValue / 100).toFixed(2)}`).equals(displayFake.CurrentMessage);
  });
});

enum Message {
  NoCoin = "INSERT COIN"
}

class Coin {
  readonly weightInGrams: number;
  readonly sizeInMillimeters: number;

  constructor(weightInGrams: number, sizeInMillimeters: number) {
    this.weightInGrams = weightInGrams;
    this.sizeInMillimeters = sizeInMillimeters;
  }
}

class CoinMachine {
  public getValueInCentsByCoin(coin: Coin): number {
    if (coin.weightInGrams == 5)
      return 5;
    else
      return 10;
  }
}

class VendingMachine {
  display: IDisplay;
  coinMachine: CoinMachine;
  constructor(display: IDisplay) {
    this.display = display;
    this.coinMachine = new CoinMachine();
  }

  public vend(): void {
    this.display.update(Message.NoCoin);
  }

  public insertCoin(coin: Coin): void {
    var coinValue = this.coinMachine.getValueInCentsByCoin(coin);
    this.display.update(`\$${(coinValue / 100).toFixed(2)}`);
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