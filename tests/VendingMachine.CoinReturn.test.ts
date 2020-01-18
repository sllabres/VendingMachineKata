import { expect } from "chai";
import { CoinMachine, ChangeMachine } from "../src/CoinValuationMachine";
import { Coin } from "../src/Coin";

var coinMachine: ChangeMachine;

beforeEach(function () {
  coinMachine = new ChangeMachine([new Coin(5, 24, 25), new Coin(5, 21, 5), new Coin(2.2, 17, 10)]);  
});

describe('given 25 cents inserted', function () {
  it('then quater given in change', function () {
    var coins = coinMachine.getCoinsByValue(25)[0];    
    expect(25).equals(coins.valueInCents);
  });
});

describe('given 50 cents inserted', function () {
  it('then two quaters given in change', function () {
    var coins = coinMachine.getCoinsByValue(50);
    expect(2).equals(coins.length);
    expect(50).equals(coins.reduce((i,c) => { return c.valueInCents + i }, 0));
  });
});

describe('given 65 cents inserted', function () {
  it('then two quaters, a dime and a nickel given in change', function () {
    var coins = coinMachine.getCoinsByValue(65);
    expect(4).equals(coins.length);
    expect(65).equals(coins.reduce((i,c) => { return c.valueInCents + i }, 0));
  });
});