import { Locator, Page } from "@playwright/test"

export class ProductsPage {
    private page: Page
    public inventoryList: Locator
    public inventoryItems: Locator
    public backToProductsButton: Locator
    public sortButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.inventoryList = page.locator('[data-test="inventory-list"]')
        this.inventoryItems = page.locator('[data-test="inventory-item"]')
        this.backToProductsButton = page.locator('[data-test="back-to-products"]')
        this.sortButton = page.locator('[data-test="product-sort-container"]')
    }

    public getItemTitle(item: Locator) {
        return item.locator('[data-test="inventory-item-name"]');
    }

    public getItemDescription(item: Locator) {
        return item.locator('[data-test="inventory-item-desc"]');
    }

    public getItemImage(item: Locator) {
        return item.locator('img');
    }

    public getItemPrice(item: Locator) {
        return item.locator('[data-test="inventory-item-price"]');
    }

    public getItemAddToCartButton(item: Locator) {
        return item.getByRole('button');
    }

    public async getItemContents(item: Locator): Promise<ItemContents> {
        const title = await this.getItemTitle(item).textContent();
        const desc = await this.getItemDescription(item).textContent();
        const price = await this.getItemPrice(item).textContent();
        const image = await this.getItemImage(item).getAttribute('src');

        return {
            title,
            desc,
            price,
            image
        }
    }

    public static buttonTexts = {
        addToCart: 'Add to cart',
        removeFromCart: 'Remove'
    } satisfies Record<string, string>

}

export interface ItemContents {
    title: string | null;
    desc: string | null;
    price: string | null;
    image: string | null;
}