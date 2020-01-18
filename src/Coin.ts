import { Disc } from "./Disc";
export class Coin extends Disc {
  readonly valueInCents: number;
  constructor(weightInGrams: number, diameterInMillimeters: number, valueInCents: number) {
    super(weightInGrams, diameterInMillimeters);
    this.valueInCents = valueInCents;
  }
}