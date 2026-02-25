import { expect, test as base } from '@playwright/test'
import { LoginPage } from '../pages/login'

const test = base.extend<{ loginPage: LoginPage }>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await use(loginPage);
    }
})

test('should login correctly', async ({ loginPage }) => {
    await loginPage.fillLoginDetails('standard_user', 'secret_sauce');
    await loginPage.isInProductsPage();
})

test('should show error message when only entering username', async ({ loginPage }) => {
    await loginPage.fillLoginDetails('standard_user');
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.passwordRequired);
})

test('should show error message when only entering password', async ({ loginPage }) => {
    await loginPage.fillLoginDetails(undefined, 'secret_sauce');
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.usernameRequired);
})

test('should show error message when not entering any fields', async ({ loginPage }) => {
    await loginPage.fillLoginDetails();
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.usernameRequired);
})

test('should show error message when entering correct username and wrong password', async ({ loginPage }) => {
    await loginPage.fillLoginDetails('standard_user', 'wrong_password');
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.wrongInput);
})

test('should show error message when user is locked out', async ({ loginPage }) => {
    await loginPage.fillLoginDetails('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toContainText(LoginPage.errorMessages.lockedOut);
})