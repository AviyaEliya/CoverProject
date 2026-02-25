import { expect, Locator, Page } from '@playwright/test'

export class LoginPage {
    private page: Page
    public usernameTextBox: Locator
    public passwordTextBox: Locator
    public loginButton: Locator
    public errorMessage: Locator

    constructor(page: Page) {
        this.page = page;
        this.usernameTextBox = page.locator('[data-test="username"]')
        this.passwordTextBox = page.locator('[data-test="password"]')
        this.loginButton = page.locator('[data-test="login-button"]')
        this.errorMessage = page.locator('[data-test="error"]')

    }

    public async goto() {
        await this.page.goto('https://www.saucedemo.com/')
    }

    public async fillLoginDetails(username?: string, password?: string) {
        if (username) await this.usernameTextBox.fill(username)
        if (password) await this.passwordTextBox.fill(password)
        await this.loginButton.click()
    }

    public async isInProductsPage() {
        expect(this.page.url()).toContain('inventory')
    }

    public static errorMessages = {
        lockedOut: 'Sorry, this user has been locked out.',
        wrongInput: 'Username and password do not match any user in this service',
        passwordRequired: 'Password is required',
        usernameRequired: 'Username is required',
        cantAccessPage: 'You can only access \'/inventory.html\' when you are logged in'
    } satisfies Record<string, string>
}