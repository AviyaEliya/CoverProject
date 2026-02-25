import { Locator, Page } from "@playwright/test"

export class ShoppingCartPage {
    private page: Page
    public cartList: Locator
    public inventoryItems: Locator
    public continueShoppingButton: Locator
    public checkoutButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.cartList = page.locator('[data-test="cart-list"]')
        this.inventoryItems = page.locator('[data-test="inventory-item"]')
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]')
        this.checkoutButton = page.locator('[data-test="checkout"]')
    }


    public getItemTitle(item: Locator) {
        return item.locator('[data-test="inventory-item-name"]');
    } 
    public getItemRemoveButton(item: Locator) {
        return item.locator('button');
    }

    public getItemDescription(item: Locator) {
        return item.locator('[data-test="inventory-item-desc"]');
    }

    public getItemPrice(item: Locator) {
        return item.locator('[data-test="inventory-item-price"]');
    }

    public async getItemContents(item: Locator) {
        const title = await this.getItemTitle(item).textContent();
        const desc = await this.getItemDescription(item).textContent();
        const price = await this.getItemPrice(item).textContent();

        return {
            title,
            desc,
            price
        }
    }
}