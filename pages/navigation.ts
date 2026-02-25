import { Locator, Page } from "@playwright/test"

export class Navigation{
    private page: Page
    public shoppingCartLink: Locator
    public shoppingCartBadge: Locator


    constructor(page: Page) {
        this.page = page;
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]')
        this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]')

    }
}