import { IDisplay } from "./IDisplay";
import { Disc } from "./Disc";
import { Message } from "./Message";
import { CoinMachine, ChangeMachine } from "./CoinValuationMachine";
import { DollarCurrencyFormat } from "./DollarCurrencyFormat";
import { ProductStore, Product } from "./ProductStore";

export class VendingMachine {
    private readonly display: IDisplay;
    private readonly coinMachine: CoinMachine;
    private readonly productStore: ProductStore;
    private readonly changeMachine: ChangeMachine;
    private runningTotal: number;
    private ejectedCoins: Array<Disc>;    

    constructor(display: IDisplay, coinValuation: CoinMachine, productStore: ProductStore, changeMachine: ChangeMachine) {
        this.changeMachine = changeMachine;
        this.display = display;
        this.coinMachine = coinValuation;
        this.runningTotal = 0;
        this.ejectedCoins = [];
        this.productStore = productStore;
    }
    
    public vend(selection: string): void {
        this.productStore.Purchase(selection, (p: Product) => {
            if (this.runningTotal >= p.Value) {
                this.display.update(Message.Thank);
                this.runningTotal -= p.Value;
            } else {
                this.display.update(Message.Price);
            }
        }, () => {
            this.display.update(Message.SoldOut);
        });
    }

    public getChange(): Array<Disc> {
        var coins = this.changeMachine.getCoinsByValue(this.runningTotal);
        this.runningTotal = 0;        
        return this.ejectedCoins.concat(coins);
    }

    public refreshDisplay(): void {
        if (this.runningTotal == 0) {
            this.display.update(Message.InsertCoin);
        } else {
            this.display.update(DollarCurrencyFormat.Format(this.runningTotal));
        }
    }

    public insertCoin(disc: Disc): void {
        var value = this.coinMachine.getValueInCents(disc, (d) => {
            this.ejectedCoins.push(d);
        });
        this.runningTotal += value;
        this.refreshDisplay();
    }
}
