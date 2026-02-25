import { Locator, Page } from "@playwright/test"

export class CheckoutPage {
    private page: Page
    public firstNameTextbox: Locator
    public lastNameTextbox: Locator
    public postalCodeTextbox: Locator
    public cancelButton: Locator
    public continueButton: Locator
    public finishButton: Locator
    public backToProductsButton: Locator
    public errorMessage: Locator
    public inventoryItems: Locator
    public itemTotalPrice: Locator


    constructor(page: Page) {
        this.page = page;
        this.firstNameTextbox = page.locator('[data-test="firstName"]')
        this.lastNameTextbox = page.locator('[data-test="lastName"]')
        this.postalCodeTextbox = page.locator('[data-test="postalCode"]')
        this.continueButton = page.locator('[data-test="continue"]')
        this.finishButton = page.locator('[data-test="finish"]')
        this.cancelButton = page.locator('[data-test="cancel"]')
        this.backToProductsButton = page.locator('[data-test="back-to-products"]')
        this.errorMessage = page.locator('[data-test="error"]')
        this.inventoryItems = page.locator('[data-test="inventory-item"]')
        this.itemTotalPrice = page.locator('[data-test="subtotal-label"]')

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

    public async fillCheckoutDetails() {
        await this.firstNameTextbox.fill('firstName');
        await this.lastNameTextbox.fill('lastName');
        await this.postalCodeTextbox.fill('postalCode');
        await this.continueButton.click();
    }

}
