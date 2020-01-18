import { expect } from "chai";
import { CoinMachine } from "../src/CoinValuationMachine";
import { Coin } from "../src/Coin";

class DisplayFake {
  public CurrentMessage: string = "";
  public update(message: string): void {
    this.CurrentMessage = message;
  }
}

var coinValuation: CoinMachine;

beforeEach(function () {
  coinValuation = new CoinMachine([new Coin(5, 24, 25), new Coin(5, 21, 5), new Coin(2.2, 17, 10)]);  
});

describe('given 25 cents inserted', function () {
  it('then quater given in change', function () {
    var coins = coinValuation.getCoinsByValue(25)[0];    
    expect(25).equals(coins.valueInCents);
  });
});

describe('given 50 cents inserted', function () {
  it('then two quaters given in change', function () {
    var coins = coinValuation.getCoinsByValue(50);
    expect(2).equals(coins.length);
    expect(50).equals(coins.reduce((i,c) => { return c.valueInCents + i }, 0));
  });
});

describe('given 65 cents inserted', function () {
  it('then two quaters, a dime and a nickel given in change', function () {
    var coins = coinValuation.getCoinsByValue(65);
    expect(4).equals(coins.length);
    expect(65).equals(coins.reduce((i,c) => { return c.valueInCents + i }, 0));
  });
});