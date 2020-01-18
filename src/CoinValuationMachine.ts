import { Coin } from "./Coin";
import { Disc } from "./Disc";

export class CoinValuationMachine {
    readonly coinTypes: Array<Coin>;
    constructor() {
      this.coinTypes = [new Coin(5, 24, 25), new Coin(5, 21, 5), new Coin(2.2, 17, 10)];
    }
  
    public getValueInCents(disc: Disc, onInvalid: (d: Disc) => void = (d) => {}): number {
      var value = this.coinTypes.filter(ct => ct.diameterInMillimeters == disc.diameterInMillimeters && ct.weightInGrams == disc.weightInGrams)[0]?.valueInCents ?? 0;
      if (value == 0)
        onInvalid(disc);
      return value;
    }
  
    public getCoinByValue(valueInCents: number, onCoinFound: (c: Coin) => void): void {
      var coin = this.coinTypes.filter(ct => ct.valueInCents == valueInCents)[0];
      if (coin)
        onCoinFound(coin);
    }
  }