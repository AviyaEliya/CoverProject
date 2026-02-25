import { Locator, Page } from "@playwright/test"

export class Navigation{
    private page: Page
    public shoppingCartLink: Locator
    public shoppingCartBadge: Locator
    public menuButton: Locator
    public logoutButton: Locator
    public aboutButton: Locator
    public allItemsButton: Locator


    constructor(page: Page) {
        this.page = page;
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]')
        this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]')
        this.menuButton = page.locator('#react-burger-menu-btn')
        this.logoutButton = page.locator('[data-test="logout-sidebar-link"]')
        this.aboutButton = page.locator('[data-test="about-sidebar-link"]')
        this.allItemsButton = page.locator('[data-test="inventory-sidebar-link"]')

    }
}