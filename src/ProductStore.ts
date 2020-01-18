export class ProductStore {
    private readonly products: Array<Product>;
    constructor(products: Array<Product>) {
        this.products = products;
    }
    public Purchase(sku: string, onSuccess: (p: Product) => void, onSoldOut: () => void): void {
        var product = this.products.filter(p => p.SKU == sku)[0];
        if (product && product.Quantity > 0) {
            product = new Product(product.SKU, product.Value, product.Quantity - 1);            
            onSuccess(product);
        } else if (product?.Quantity == 0) {
            onSoldOut();
        }
    }
}

export class Product {
    public readonly SKU: string;
    public readonly Value: number;
    public Quantity: number;
    constructor(SKU: string, value: number, quantity: number) {
        this.SKU = SKU;
        this.Value = value;
        this.Quantity = quantity;
    }
}