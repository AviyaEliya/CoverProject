import { expect, test as base } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { CheckoutPage } from '../pages/checkout';
import { Navigation } from '../pages/navigation';
import { ItemContents, ProductsPage } from '../pages/products';
import { ShoppingCartPage } from '../pages/shoppingCart';

const test = base.extend<{
    checkoutPageData: {
        shoppingCartPage: ShoppingCartPage,
        itemContents: ItemContents[],
        productsPage: ProductsPage,
        navigation: Navigation
        checkoutPage: CheckoutPage
    }
}>({
    checkoutPageData: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.fillLoginDetails(process.env.STANDARD_USERNAME, process.env.PASSWORD);
        await loginPage.isInProductsPage();
        const productsPage = new ProductsPage(page);
        const items = await productsPage.inventoryItems.all();
        await productsPage.getItemAddToCartButton(items[0]).click();
        await productsPage.getItemAddToCartButton(items[1]).click();
        const itemContents1 = await productsPage.getItemContents(items[0])
        const itemContents2 = await productsPage.getItemContents(items[1])
        const navigation = new Navigation(page);
        await navigation.shoppingCartLink.click();
        const shoppingCartPage = new ShoppingCartPage(page);
        await shoppingCartPage.checkoutButton.click();
        const checkoutPage = new CheckoutPage(page);
        await use({ checkoutPage, shoppingCartPage, productsPage, navigation, itemContents: [itemContents1, itemContents2] });
    }
})

test('should fail to checkout without inputting any personal details', async ({ checkoutPageData: { checkoutPage } }) => {
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toBeVisible();
})

test('items in checkout screen should be the same as in cart', async ({ checkoutPageData: { itemContents, checkoutPage } }) => {
    await checkoutPage.fillCheckoutDetails();

    const items = await checkoutPage.inventoryItems.all();
    await expect(items).toHaveLength(2);
    const itemContentWithoutImage = itemContents.map(({ image, ...rest }) => rest);
    await expect(await checkoutPage.getItemContents(items[0])).toEqual(itemContentWithoutImage[0]);
    await expect(await checkoutPage.getItemContents(items[1])).toEqual(itemContentWithoutImage[1]);
})

test('clicking on item title in checkout should direct to the correct item card', async ({ checkoutPageData: { itemContents, checkoutPage, productsPage } }) => {
    await checkoutPage.fillCheckoutDetails();

    const item = await checkoutPage.inventoryItems.first();
    const checkoutItemContent = await checkoutPage.getItemContents(item);
    await checkoutPage.getItemTitle(item).click();

    const { image, ...cardItemContentsWithoutImage } = await productsPage.getItemContents(await productsPage.inventoryItems.first())

    await expect(checkoutItemContent).toEqual(cardItemContentsWithoutImage);
})

test('item total price in checkout should be correct', async ({ checkoutPageData: { itemContents, checkoutPage } }) => {
    await checkoutPage.fillCheckoutDetails();

    const items = await checkoutPage.inventoryItems.all();
    const itemPriceText1 = await checkoutPage.getItemPrice(items[0]).textContent();
    const itemPriceText2 = await checkoutPage.getItemPrice(items[1]).textContent();
    const itemPrice1 = itemPriceText1?.replaceAll(/\$/g, '');
    const itemPrice2 = itemPriceText2?.replaceAll(/\$/g, '');
    if(!itemPrice1|| !itemPrice2) return test.fail()
    const total = +itemPrice1 + +itemPrice2
    await expect(checkoutPage.itemTotalPrice).toContainText('$'+total);

})

test('"back home" button after purchase should direct to product page and reset items', async ({ checkoutPageData: { itemContents, checkoutPage, productsPage } }) => {
    await checkoutPage.fillCheckoutDetails();
    await checkoutPage.finishButton.click();
    await checkoutPage.backToProductsButton.click();

    await expect(productsPage.inventoryList).toBeVisible();

    const items = await productsPage.inventoryItems.all();

    for (const item of items) {
        await expect(productsPage.getItemAddToCartButton(item)).toHaveText(ProductsPage.buttonTexts.addToCart)
    }
})

test('Cancel button should direct back to shopping cart with the items', async ({ checkoutPageData: { itemContents, checkoutPage, productsPage, shoppingCartPage } }) => {
    await checkoutPage.cancelButton.click()

    await expect(shoppingCartPage.inventoryItems).toHaveCount(itemContents.length)
})
