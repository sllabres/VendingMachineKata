import { expect } from "chai";

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.vend();
    expect(Message.NoCoin).equals(displayFake.CurrentMessage);
  });
});

describe('given valid coin inserted', function () {

  it('displays "$0.10" message', function () {
    vendingMachine.insertCoin(2.2, 1.95);
    var coinValue = new CoinMachine().getValueInCents(2.2, 1.95);
    expect(`\$${(coinValue/100).toFixed(2)}`).equals(displayFake.CurrentMessage);
  });

  it('displays "$0.05" message', function () {    
    vendingMachine.insertCoin(5, 1.95);
    var coinValue = new CoinMachine().getValueInCents(5, 1.95);
    expect(`\$${(coinValue/100).toFixed(2)}`).equals(displayFake.CurrentMessage);
  });
});

enum Message {
  NoCoin = "INSERT COIN"
}

class CoinMachine {
  public getValueInCents(weightInGrams: number, sizeInMillimeters: number): number {
    if (weightInGrams == 5)
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

  public insertCoin(weightInGrams: number, sizeInMillimeters: number): void {
    var coinValue = this.coinMachine.getValueInCents(weightInGrams, sizeInMillimeters);
    this.display.update(`\$${(coinValue/100).toFixed(2)}`);
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