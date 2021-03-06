import { expect } from "chai";
import { VendingMachine } from "../src/VendingMachine";
import { ProductStore, Product } from "../src/ProductStore";
import { Messages } from "../src/Messages";
import { CoinValuationMachine } from "../src/CoinValuationMachine";
import { ChangeMachine } from "../src/ChangeMachine";
import { Disc } from "../src/Disc";
import { Coin } from "../src/Coin";
import { DisplayFake } from "./DisplayFake";
import { ProductDispneserFake } from "./ProductDispneserFake";

var display: DisplayFake;
var coinMachine: CoinValuationMachine;
var vendingMachine: VendingMachine;
var quater: Coin = new Coin(5, 24, 25);
var dime: Coin = new Coin(5, 21, 10);
var nickel: Coin = new Coin(2.2, 17, 5);

beforeEach(function () {
  display = new DisplayFake();  
  coinMachine = new CoinValuationMachine([quater, dime, nickel]);  
  vendingMachine = new VendingMachine(display, coinMachine, new ProductStore([]), new ChangeMachine([quater]), new ProductDispneserFake());
});

describe('given no coin inserted', function () {
  it('displays "INSERT COIN" message', function () {
    vendingMachine.refreshDisplay();
    expect(Messages.InsertCoin).equals(display.CurrentMessage);
  });
});

describe('given nickel inserted', function () {
  it('displays "$0.05" message', function () {
    vendingMachine.insertCoin(nickel);
    expect("$0.05").equals(display.CurrentMessage);
  });
});

describe('given dime inserted', function () {
  it('displays "$0.10" message', function () {
    vendingMachine.insertCoin(dime);
    expect("$0.10").equals(display.CurrentMessage);
  });
});

describe('given quarter inserted', function () {
  it('displays "$0.25" message', function () {
    var coinToInsert = coinMachine.getCoinByValue(25);
    vendingMachine.insertCoin(coinToInsert);
    expect("$0.25").equals(display.CurrentMessage);
  });
});

describe('given two quarters inserted', function () {
  it('displays "$0.50" message', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(quater);
    expect("$0.50").equals(display.CurrentMessage);
  });
});

describe('given quarter and dime inserted', function () {
  it('displays "$0.35" message', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(dime);
    expect("$0.35").equals(display.CurrentMessage);
  });
});

describe('given invalid coin inserted', function () {
  it('displays "INSERT COIN" message and gives change', function () {
    var coinToInsert = new Disc(0, 0);
    vendingMachine.insertCoin(coinToInsert);
    var change = vendingMachine.getChange();
    vendingMachine.refreshDisplay();
    expect(Messages.InsertCoin).equals(display.CurrentMessage);
    expect(1).equals(change.length);
  });
});

describe('given quarter and then invalid coin inserted', function () {
  it('displays "INSERT COIN" message and gives change', function () {
    vendingMachine.insertCoin(quater);
    vendingMachine.insertCoin(new Disc(0, 0));
    var change = vendingMachine.getChange();
    expect("$0.25").equals(display.CurrentMessage);
    expect(2).equals(change.length);
  });
});