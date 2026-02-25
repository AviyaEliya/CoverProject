import { expect, test as base } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { ProductsPage } from '../pages/products';
import { Navigation } from '../pages/navigation';
import { ShoppingCartPage } from '../pages/shoppingCart';

const test = base.extend<{ navigation: Navigation, loginPage: LoginPage, shoppingCartPage:ShoppingCartPage, productsPage: ProductsPage }>({
    navigation: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.fillLoginDetails(process.env.STANDARD_USERNAME, process.env.PASSWORD);
        await loginPage.isInProductsPage();
        const navigation = new Navigation(page);

        await use(navigation);
    },
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page)
        await use(loginPage)
    },
    shoppingCartPage: async ({ page }, use) => {
        const shoppingCartPage = new ShoppingCartPage(page)
        await use(shoppingCartPage)
    },
    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page)
        await use(productsPage)
    },
})

test('should match snapshot', async ({page, navigation}) => {
    await expect(navigation.menuButton).toBeVisible()
    await expect(page).toHaveScreenshot()
})

test('logout button should direct to login screen', async ({navigation, loginPage}) => {
    await navigation.menuButton.click();
    await navigation.logoutButton.click();
    await expect(loginPage.loginButton).toBeVisible();
})

test('fail to reach products page when logged out', async ({navigation, loginPage, page}) => {
    await navigation.menuButton.click();
    await navigation.logoutButton.click();
    await expect(loginPage.loginButton).toBeVisible();
    await page.goto('/inventory.html');
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.cantAccessPage);
})

test('should direct to products page when clicking "All Items" button', async ({navigation, shoppingCartPage, loginPage}) => {
    await navigation.shoppingCartLink.click()

    await navigation.menuButton.click();
    await navigation.allItemsButton.click();
    await loginPage.isInProductsPage()
})

test('should save items after logout and login', async ({navigation, productsPage, loginPage}) => {
    const items = await productsPage.inventoryItems.all();
    await productsPage.getItemAddToCartButton(items[0]).click();
    await productsPage.getItemAddToCartButton(items[1]).click();

    await navigation.menuButton.click();
    await navigation.logoutButton.click();
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.fillLoginDetails(process.env.STANDARD_USERNAME, process.env.PASSWORD);
    await loginPage.isInProductsPage();

    const items2 = await productsPage.inventoryItems.all();
    await expect(productsPage.getItemAddToCartButton(items2[0])).toHaveText(ProductsPage.buttonTexts.removeFromCart)
    await expect(productsPage.getItemAddToCartButton(items2[1])).toHaveText(ProductsPage.buttonTexts.removeFromCart)
})

test('should direct to shopping cart when clicking the shopping cart icon', async({navigation, shoppingCartPage}) => {
    await navigation.shoppingCartLink.click()
    await expect(shoppingCartPage.cartList).toBeVisible();
})

test('should redirect outside page when clicking the "about" button', async({navigation, page}) => {
    await navigation.menuButton.click();
    await navigation.aboutButton.click();

    await expect(page.url()).toContain(process.env.ABOUT_PAGE_URL)
})