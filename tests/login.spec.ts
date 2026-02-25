import { expect, test as base } from '@playwright/test'
import { LoginPage } from '../pages/login'

const test = base.extend<{ loginPage: LoginPage }>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await use(loginPage);
    }
})

test('should match snapshot', async ({page, loginPage}) => {
    await expect(loginPage.loginButton).toBeVisible()
    await expect(page).toHaveScreenshot()
})

test('should login correctly', async ({ loginPage }) => {
    await loginPage.fillLoginDetails(process.env.STANDARD_USERNAME, process.env.PASSWORD);
    await loginPage.isInProductsPage();
})

test('should show error message when only entering username', async ({ loginPage }) => {
    await loginPage.fillLoginDetails(process.env.STANDARD_USERNAME);
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.passwordRequired);
})

test('should show error message when only entering password', async ({ loginPage }) => {
    await loginPage.fillLoginDetails(undefined, process.env.PASSWORD);
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.usernameRequired);
})

test('should show error message when not entering any fields', async ({ loginPage }) => {
    await loginPage.fillLoginDetails();
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.usernameRequired);
})

test('should show error message when entering correct username and wrong password', async ({ loginPage }) => {
    await loginPage.fillLoginDetails(process.env.STANDARD_USERNAME, 'wrong_password');
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.wrongInput);
})

test('should show error message when user is locked out', async ({ loginPage }) => {
    await loginPage.fillLoginDetails(process.env.LOCKED_OUT_USERNAME, process.env.PASSWORD);
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.lockedOut);
})