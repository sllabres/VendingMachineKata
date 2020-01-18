import { IDisplay, CoinValuationMachine, Disc, Message, DollarCurrencyFormat } from "../tests/VendingMachine.test";
export class VendingMachine {
    private readonly display: IDisplay;
    private readonly coinValuation: CoinValuationMachine;
    private runningTotal: number;
    private ejectedCoins: Array<Disc>;
    constructor(display: IDisplay, coinValuation: CoinValuationMachine) {
        this.display = display;
        this.coinValuation = coinValuation;
        this.runningTotal = 0;
        this.ejectedCoins = [];
    }
    public vend(selection: string): void {
        if (this.runningTotal >= 100) {
            this.display.update(Message.Thank);
            this.runningTotal -= 100;
        }
        else
            this.display.update(Message.Price);        
    }
    public getChange(): Array<Disc> {
        return this.ejectedCoins;
    }
    public refreshDisplay(): void {
        if (this.runningTotal == 0) {
            this.display.update(Message.NoCoin);
        } else {
            this.display.update(DollarCurrencyFormat.Format(this.runningTotal));
        }
    }
    public insertCoin(disc: Disc): void {
        var value = this.coinValuation.getValueInCents(disc, (d) => {
            this.ejectedCoins.push(d);
        });
        this.runningTotal += value;
        this.display.update(DollarCurrencyFormat.Format(this.runningTotal));
    }
}
