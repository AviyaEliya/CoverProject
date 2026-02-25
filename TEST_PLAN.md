# Test Plan

## Tests Scopes
- UI compliance - tests the UI functionalities are working as intended
- System compliance - tests broad flows in the system (checkout)
- Security (mild) - tests restricted access to sensitive pages

# Test Plans

## Login

| Test ID | Description | Steps | Expected Outcome | Priority |
|---------|-------------|-------|------------------|----------|
| 1 | Logging in correctly | 1. Enter a valid username in the Username field<br>2. Enter a valid password in the Password field<br>3. Click the Login button | User is redirected to the inventory/products page | High |
| 2 | Only entering username | 1. Enter a valid username only<br>2. Click Login | Error message: "Password is required" | Low |
| 3 | Only entering password | 1. Enter a valid password only<br>2. Click Login | Error message: "Username is required" | Low |
| 4 | Not entering any fields | 1. Leave both fields empty<br>2. Click Login | Error message: "Username is required" | Low |
| 5 | Correct username, wrong password | 1. Enter a valid username<br>2. Enter an incorrect password<br>3. Click Login | Error message: "Username and password do not match any user in this service" | Medium |
| 6 | Locked out user | 1. Enter credentials of a locked-out user<br>2. Click Login | Error message: "Sorry, this user has been locked out." | High |

## Products

| Test ID | Description | Steps | Expected Outcome | Priority |
|---------|-------------|-------|------------------|----------|
| 7 | Product list displays correctly | 1. Log in and go to the products page<br>2. Check each product in the inventory list | Each product shows a title, description, image, price and a "Add to cart" button | High |
| 8 | Item details match between list and detail card | 1. Note details of a product in the list<br>2. Click on its title to open the detail card | Detail card shows same title, description, image and price as the list entry | High |
| 9 | Add to cart from item detail card | 1. Click a product title to open detail card<br>2. Click "Add to cart"<br>3. Go back to the products page | Button changes to "Remove" on the detail card, and the product in the list also shows "Remove" | Medium |
| 10 | Items remain chosen after refresh | 1. Click "Add to cart" on a product<br>2. Refresh the page | Products button still shows "Remove" after refresh | Medium |
| 11 | Sorting by name (Z to A) | 1. Select "Z to A" sort option from dropdown | Products are sorted in reverse alphabetical order | Medium |
| 12 | Sorting by price (high to low) | 1. Select "High to Low" sort option from dropdown | Products are sorted in descending order by price | Medium |

## Shopping Cart

| Test ID | Description | Steps | Expected Outcome | Priority |
|---------|-------------|-------|------------------|----------|
| 13 | Added items appear in cart | 1. Add two products to cart from the products page<br>2. Go to the shopping cart | Cart contains two items with matching titles, descriptions, and prices | High |
| 14 | Remove item from cart | 1. Add two products to cart and navigate to it<br>2. Click "Remove" on first item | First item is removed and not visible in the cart anymore | High |
| 15 | Go to item detail card from cart | 1. Add products to cart and navigate to it<br>2. Click on title of the first item | Detail card opens with same title, description, image and price | Medium |
| 16 | Continue shopping button | 1. Navigate to shopping cart<br>2. Click "Continue Shopping" | Redirects to the products page, inventory list is visible | Medium |
| 17 | Cart badge after adding products | 1. Add two products to the cart | Shopping cart badge shows "2" | Medium |
| 18 | Cart badge after removing products | 1. Add two products, go to the cart<br>2. Remove one product | Shopping cart badge updates to show "1" | Medium |

## Checkout

| Test ID | Description | Steps | Expected Outcome | Priority |
|---------|-------------|-------|------------------|----------|
| 19 | Checkout without personal details | 1. Add products to cart and go to checkout<br>2. Click "Continue" without filling in personal details | Error message is shown | Medium |
| 20 | Items in checkout match cart | 1. Add two products to cart<br>2. Go to checkout and fill in personal details | Checkout overview shows two items with matching titles, descriptions and prices | High |
| 21 | Click item title in checkout | 1. Go to checkout and fill in personal details<br>2. Click on title of the first item | Item detail card opens with matching title, description and price | Medium |
| 22 | Item total is correct | 1. Add two products to cart<br>2. Go to checkout, fill personal details | Subtotal equals sum of item prices | High |
| 23 | "Back Home" button resets cart | 1. Go through checkout, click "Finish"<br>2. Click "Back Home" | Goes back to products page, all items show "Add to cart" again | Medium |
| 24 | Cancel button | 1. Go to checkout<br>2. Click "Cancel" | Goes back to cart, items still there | Medium |

## Navigation

| Test ID | Description | Steps | Expected Outcome | Priority |
|---------|-------------|-------|------------------|----------|
| 25 | Logout redirects to login | 1. Open side menu<br>2. Click "Logout" | Redirected to login page, login button visible | High |
| 26 | Cant access products when logged out | 1. Logout<br>2. Try going to inventory page URL directly | Stays on login page, error message shows up | High |
| 27 | "All Items" button | 1. Go to cart<br>2. Open menu, click "All Items" | Goes to products page | Low |
| 28 | Cart items persist after logout/login | 1. Add two products<br>2. Logout<br>3. Login again | Products still show "Remove" | Low |
| 29 | Cart icon | 1. Click cart icon | Cart page shows up | Medium |
| 30 | About button | 1. Open menu<br>2. Click "About" | Goes to external page | Low |

# Out of Scope
- Transaction verification - doesn't verify the checkout actually reaches server/DB

# Test Risks
- Tests depend on environment variables for credentials, if .env is misconfigured or missing tests will fail before they even start
- these tests aren't tuned to the future plans of this project as I don't have access to those plans

# Summary
Tests cover the main user flows of the application - login, browsing products, shopping cart, checkout and navigation. Main focus is on UI compliance and making sure the basic e2e flows work. 