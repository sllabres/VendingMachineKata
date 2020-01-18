export class ProductStore {
    private readonly products: Array<Product>;
    constructor(products: Array<Product>) {
        this.products = products;
    }
    public Purchase(sku: string, onSuccess: (p: Product) => void): void {
        var product = this.products.filter(p => p.SKU == sku)[0];
        if (product)
            onSuccess(product);
    }
}

export class Product {
    public readonly SKU: string;
    public readonly Value: number;
    constructor(SKU: string, value: number) {
        this.SKU = SKU;
        this.Value = value;
    }
}