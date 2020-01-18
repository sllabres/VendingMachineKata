import { IDisplay } from "./IDisplay";
import { Disc } from "./Disc";
import { Message } from "./Message";
import { CoinValuationMachine } from "./CoinValuationMachine";
import { DollarCurrencyFormat } from "./DollarCurrencyFormat";

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
        else if (this.runningTotal >= 50) {
            this.display.update(Message.Thank);
            this.runningTotal -= 50;
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
        this.refreshDisplay();        
    }
}

