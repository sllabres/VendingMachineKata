import { Coin } from "./Coin";
export class ChangeMachine {
  readonly coinStock: Array<Coin>;
  constructor(coins: Array<Coin>) {
    this.coinStock = coins;
  }
  public getCoinsByValue(valueInCents: number): Array<Coin> {
    var change: number = valueInCents;
    var coins: Array<Coin> = [];
    while (change > 0) {
      var coin = this.coinStock.filter(c => c.valueInCents <= change).sort((a, b) => {
        return b.valueInCents - a.valueInCents;
      })[0];
      
      if(coin) {
        change -= coin.valueInCents;
        coins.push(coin);
      } else { 
          change = 0;
      }
    }
    return coins;
  }

  public canGiveChangeOnAmount(valueInCents: number): boolean {
    return this.getCoinsByValue(valueInCents).reduce((a,b) => a + b.valueInCents, 0) == valueInCents;      
  }
}