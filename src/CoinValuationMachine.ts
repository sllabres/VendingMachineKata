import { Coin } from "./Coin";
import { Disc } from "./Disc";

export class CoinValuationMachine {
  readonly coinTypes: Array<Coin>;
  constructor(acceptedCoins: Array<Coin>) {
    this.coinTypes = acceptedCoins;
  }

  public getValueInCents(disc: Disc, onInvalid: (d: Disc) => void = (d) => { }): number {
    var value = this.coinTypes.filter(ct => ct.diameterInMillimeters == disc.diameterInMillimeters && ct.weightInGrams == disc.weightInGrams)[0]?.valueInCents ?? 0;
    if (value == 0)
      onInvalid(disc);
    return value;
  }

  public getCoinByValue(valueInCents: number): Coin {
    return this.coinTypes.filter(ct => ct.valueInCents == valueInCents)[0];    
  }
}

