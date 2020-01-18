import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { CoinValuationMachine } from "../src/CoinValuationMachine";

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var coinValuation: CoinValuationMachine;

beforeEach(function () {
  coinValuation = new CoinValuationMachine();  
});

describe('given 25 cents', function () {
  it('then quater given in change', function () {
    var coins = coinValuation.getCoinsByValue(25)[0];    
    expect(25).equals(coins.valueInCents);
  });
});

describe('given 50 cents', function () {
  it('then two quaters given in change', function () {
    var coins = coinValuation.getCoinsByValue(50);
    expect(2).equals(coins.length);
    expect(50).equals(coins.reduce((i,c) => { return c.valueInCents + i }, 0));
  });
});

describe('given 65 cents', function () {
  it('then two quaters, a dime and a nickel given in change', function () {
    var coins = coinValuation.getCoinsByValue(65);
    expect(4).equals(coins.length);
    expect(65).equals(coins.reduce((i,c) => { return c.valueInCents + i }, 0));
  });
});