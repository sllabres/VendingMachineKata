import { expect } from "chai";
import { CoinValuationMachine } from "../src/CoinValuationMachine";
import { ChangeMachine } from "../src/ChangeMachine";
import { Coin } from "../src/Coin";

var coinMachine: ChangeMachine;

beforeEach(function () {
  var quater: Coin = new Coin(5, 24, 25);
  var dime: Coin = new Coin(5, 21, 10);
  var nickel: Coin = new Coin(2.2, 17, 5);
  coinMachine = new ChangeMachine([quater, nickel, dime]);
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
    expect(50).equals(coins.reduce((i, c) => { return c.valueInCents + i }, 0));
  });
});

describe('given 65 cents inserted', function () {
  it('then two quaters, a dime and a nickel given in change', function () {
    var coins = coinMachine.getCoinsByValue(65);
    expect(4).equals(coins.length);
    expect(65).equals(coins.reduce((i, c) => { return c.valueInCents + i }, 0));
  });
});

describe('given 66 cents inserted', function () {
  it('then can get change', function () {
    expect(coinMachine.canGiveChangeOnAmount(66)).equals(false);
  });
});