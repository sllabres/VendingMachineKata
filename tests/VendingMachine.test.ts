import { expect } from "chai";

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {    
    vendingMachine.vend();
    expect(displayFake.CurrentMessage).equals(Message.NoCoin);
  });
});

describe('given valid coin inserted', function () {
  it('displays "$0.05" message', function () {
    vendingMachine.insertCoin();
    expect(displayFake.CurrentMessage).equals("$0.05");
  });

  it('displays "$0.10" message', function () {
    vendingMachine.insertCoinByDimension(2.2, 1.95);
    expect(displayFake.CurrentMessage).equals("$0.10");
  });
});

enum Message {
  NoCoin = "INSERT COIN"
}

class VendingMachine {
  display: IDisplay;
  constructor(display: IDisplay) {
    this.display = display;
  }

  public vend(): void {
    this.display.update(Message.NoCoin);
  }

  public insertCoin(): void {
    this.display.update("$0.05");
  }

  public insertCoinByDimension(weightInGrams: number, sizeInMillimeters: number) : void {
    this.display.update("$0.10");
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