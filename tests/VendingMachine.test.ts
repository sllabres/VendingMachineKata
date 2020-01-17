import { expect } from "chai";

describe('no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    var displayFake = new DisplayFake();
    var vendingMachine = new VendingMachine(displayFake);    
    vendingMachine.vend();
    expect(displayFake.CurrentMessage).equals("INSERT COIN");
  });
});

class VendingMachine{
  display: IDisplay;  
  constructor(display: IDisplay) {    
    this.display = display;
  }

  public vend(): void {
    this.display.update("INSERT COIN");
  }
}

interface IDisplay {
  update(message: string) : void;
}

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string) : void {
    this.CurrentMessage = message;
  }
}