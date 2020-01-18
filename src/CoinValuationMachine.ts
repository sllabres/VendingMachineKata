import { Coin } from "./Coin";
import { Disc } from "./Disc";

export class CoinMachine {
    readonly coinTypes: Array<Coin>;
    constructor(acceptedCoins: Array<Coin>) {
      this.coinTypes = acceptedCoins;
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

  export class ChangeMachine {
    readonly coinStock: Array<Coin>;
    constructor(coins: Array<Coin>) {
      this.coinStock = coins;
    }

    public getCoinsByValue(valueInCents: number) : Array<Coin> {
      var change: number = valueInCents;
      var coins: Array<Coin> = [];
      while(change != 0) {
        var coin = this.coinStock.filter(c => c.valueInCents <= change).sort((a,b) => {
          return b.valueInCents - a.valueInCents;
        })[0];

        change -= coin.valueInCents;
        coins.push(coin);
      }
      return coins;
    }
  }