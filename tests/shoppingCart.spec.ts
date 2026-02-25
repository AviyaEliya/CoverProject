import { expect, test as base } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { ItemContents, ProductsPage } from '../pages/products';
import { ShoppingCartPage } from '../pages/shoppingCart';
import { Navigation } from '../pages/navigation';

const test = base.extend<{ shoppingCartData: {
    shoppingCartPage: ShoppingCartPage, 
    itemContents: ItemContents[],
    productsPage: ProductsPage,
    navigation: Navigation
},  }>({
    shoppingCartData: async ({ page }, use) => {
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
        await use({shoppingCartPage, productsPage,navigation, itemContents: [itemContents1, itemContents2]});
    }
})

test('added items should appear in cart', async ({shoppingCartData:{itemContents,shoppingCartPage}})=>{
    const items = await shoppingCartPage.inventoryItems.all();
    await expect(items).toHaveLength(2);
    const itemContentWithoutImage = itemContents.map(({image, ...rest}) => rest);
    await expect(await shoppingCartPage.getItemContents(items[0])).toEqual(itemContentWithoutImage[0]);
    await expect(await shoppingCartPage.getItemContents(items[1])).toEqual(itemContentWithoutImage[1]);
})

test('delete items in cart', async ({shoppingCartData:{itemContents,shoppingCartPage}})=>{
    const items = await shoppingCartPage.inventoryItems.all();

    await shoppingCartPage.getItemRemoveButton(items[0]).click();
    if(!itemContents[0].title) return test.fail();
    await expect(shoppingCartPage.inventoryItems).not.toContainText(itemContents[0].title);

})

test('should go to item card from shopping card item', async ({shoppingCartData:{itemContents,shoppingCartPage, productsPage}})=>{
    const item = await shoppingCartPage.inventoryItems.first();
    await shoppingCartPage.getItemTitle(item).click();
    const cardItem = await productsPage.inventoryItems.first();

    const cardItemContents = await productsPage.getItemContents(cardItem);

    await expect(itemContents[0]).toEqual(cardItemContents);

})

test('should go to products page after clicking on "continue shopping button"', async ({shoppingCartData:{shoppingCartPage, productsPage}})=>{
    await shoppingCartPage.continueShoppingButton.click();
    await expect(productsPage.inventoryList).toBeVisible();

})

test('shopping cart badge number is correct after adding products', async ({shoppingCartData:{itemContents, navigation}})=>{
    await expect(navigation.shoppingCartBadge).toHaveText(itemContents.length.toString());
})

test('shopping cart badge number is correct after removing products', async ({shoppingCartData:{itemContents, shoppingCartPage, navigation}})=>{
    const items = await shoppingCartPage.inventoryItems.all();
    await shoppingCartPage.getItemRemoveButton(items[0]).click();
    await expect(navigation.shoppingCartBadge).toHaveText((itemContents.length-1).toString());
})