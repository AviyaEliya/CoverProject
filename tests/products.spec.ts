import { expect, test as base } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { ProductsPage } from '../pages/products';

const test = base.extend<{ productsPage: ProductsPage }>({
    productsPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.fillLoginDetails(process.env.STANDARD_USERNAME, process.env.PASSWORD);
        await loginPage.isInProductsPage();
        const productsPage = new ProductsPage(page);

        await use(productsPage);
    }
})

test('should display product list', async ({ productsPage }) => {
    await expect(productsPage.inventoryList).toBeVisible();
    const items = await productsPage.inventoryItems.all();
    for (const item of items) {
        await expect(productsPage.getItemTitle(item)).toBeVisible();
        await expect(productsPage.getItemDescription(item)).toBeVisible();
        await expect(productsPage.getItemImage(item)).toBeVisible();
        await expect(productsPage.getItemPrice(item)).toBeVisible();
        await expect(productsPage.getItemAddToCartButton(item)).toContainText(ProductsPage.buttonTexts.addToCart);
    }
})

test('items should remain chosen after refresh', async ({ productsPage, page }) => {
    const addToCartButton = productsPage.getItemAddToCartButton(await productsPage.inventoryItems.first());
    await addToCartButton.click();

    await expect(addToCartButton).toContainText(ProductsPage.buttonTexts.removeFromCart);

    await page.reload();

    await expect(addToCartButton).toContainText(ProductsPage.buttonTexts.removeFromCart);
})

test('item details are the same in inventory and item card', async ({ productsPage }) => {

    const item = await productsPage.inventoryItems.first();

    const itemContents = await productsPage.getItemContents(item);

    await productsPage.getItemTitle(item).click();

    await expect(productsPage.backToProductsButton).toBeVisible();
    const cardItem = await productsPage.inventoryItems.first();

    const cardItemContents = await productsPage.getItemContents(cardItem);

    await expect(itemContents).toEqual(cardItemContents);

})

test('Add to cart button should work in item card', async ({ productsPage }) => {

    const item = await productsPage.inventoryItems.first();
    await productsPage.getItemTitle(item).click();
    await expect(productsPage.backToProductsButton).toBeVisible();
    const cardItem = await productsPage.inventoryItems.first();
    await productsPage.getItemAddToCartButton(cardItem).click();
    await expect(productsPage.getItemAddToCartButton(cardItem)).toContainText(ProductsPage.buttonTexts.removeFromCart);
    await productsPage.backToProductsButton.click();

    await expect(productsPage.inventoryList).toBeVisible();
    await expect(productsPage.getItemAddToCartButton(await productsPage.inventoryItems.first())).toContainText(ProductsPage.buttonTexts.removeFromCart);

}
)
test('should sort by name(z to a)', async ({ productsPage }) => {
    await productsPage.sortButton.selectOption('za');
    let titles: (string)[] = []
    for (const item of await productsPage.inventoryItems.all()) {
        const title = await productsPage.getItemTitle(item).textContent()
        if (!title) return test.fail()
        titles.push(title)
    }

    await expect(titles).toBeSorted<string>((a, b) => b.localeCompare(a))
})

test('should sort by price (high to low)', async ({ productsPage }) => {
    await productsPage.sortButton.selectOption('hilo');
    let prices: (number)[] = []
    for (const item of await productsPage.inventoryItems.all()) {
        const priceText = await productsPage.getItemPrice(item).textContent()
        const price = priceText?.replaceAll(/\$/g, '')
        if (!price) return test.fail()
        prices.push(+price)
    }

    await expect(prices).toBeSorted<number>((a, b) => b - a)
})