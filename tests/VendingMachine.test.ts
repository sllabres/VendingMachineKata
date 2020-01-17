import { expect } from "chai";

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.vend();
    expect(displayFake.CurrentMessage).equals(Message.NoCoin);
  });
});

describe('given valid coin inserted', function () {

  it('displays "$0.10" message', function () {
    vendingMachine.insertCoin(2.2, 1.95);
    expect(displayFake.CurrentMessage).equals("$0.10");
  });

  it('displays "$0.05" message', function () {
    vendingMachine.insertCoin(5, 1.95);
    expect(displayFake.CurrentMessage).equals("$0.05");
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

  public insertCoin(weightInGrams: number, sizeInMillimeters: number): void {
    if (weightInGrams == 5)
      this.display.update("$0.05");
    else
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