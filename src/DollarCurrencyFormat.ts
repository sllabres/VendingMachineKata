export class DollarCurrencyFormat {
    public static Format(valueInCents: number): string {
        return `\$${(valueInCents / 100).toFixed(2)}`;
    }
}
