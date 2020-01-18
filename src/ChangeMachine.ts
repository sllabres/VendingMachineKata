import { Coin } from "./Coin";
export class ChangeMachine {
  readonly coinStock: Array<Coin>;
  constructor(coins: Array<Coin>) {
    this.coinStock = coins;
  }
  public getCoinsByValue(valueInCents: number): Array<Coin> {
    var coins: Array<Coin> = [];
    var changeRemaining: number = valueInCents;
    this.coinStock.sort((a, b) => b.valueInCents - a.valueInCents).forEach(c => {
      var quotient = Math.floor(changeRemaining / c.valueInCents);      
      for (let i = 0; i < quotient; i++) {
        changeRemaining -= c.valueInCents;
        coins.push(c);
      }
    });
    return coins;
  }

  public canGiveChangeOnAmount(valueInCents: number): boolean {
    return this.getCoinsByValue(valueInCents).reduce((a, b) => a + b.valueInCents, 0) == valueInCents;
  }
}