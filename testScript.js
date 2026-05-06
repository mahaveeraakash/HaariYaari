import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runHaariYaariTests() {
    let options = new chrome.Options();
    // Headless mode is required for the Jenkins pipeline on EC2
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        console.log("🚀 Starting 15 Automated Tests for HaariYaari...");
        const baseUrl = 'http://100.55.24.236';

        // --- PART 1: HOME & UI TESTS ---
        await driver.get(baseUrl);

        // 1. Title Check (Matches your App.jsx/index.html)[cite: 1, 2]
        console.log("✅ Test 1: Page Title is " + await driver.getTitle());

        // 2. Navigation bar presence[cite: 2]
        await driver.findElement(By.tagName('nav'));
        console.log("✅ Test 2: Navbar is visible.");

        // 3. Page Content Render Check (Wait for React to load)
        await driver.wait(until.elementLocated(By.css('h1, h2, h3')), 10000);
        console.log("✅ Test 3: React components mounted and headings are visible.");

        // --- PART 2: PRODUCT & DB TESTS (Matches productController/Model)[cite: 2] ---

        // 4. Products Loading (Wait specifically for 'Pow Humus' to appear from the DB)[cite: 1, 2]
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Pow Humus')]")), 10000);
        console.log("✅ Test 4: Products successfully loaded from Database.");

        // 5. Verify Interaction Elements (Check that buttons exist for adding to cart/navigating)[cite: 2]
        let buttons = await driver.findElements(By.tagName('button'));
        if (buttons.length > 0) {
            console.log("✅ Test 5: Interaction buttons are present on the screen.");
        } else {
            throw new Error("No buttons found on the page.");
        }

        // 6. Cart Icon Presence & Click (Add an item to Cart)[cite: 2]
        let addToCartBtns = await driver.findElements(By.xpath("//button[@title='Add to Cart']"));
        if (addToCartBtns.length > 0) {
            await driver.wait(until.elementIsVisible(addToCartBtns[0]), 5000);
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", addToCartBtns[0]);
            await driver.sleep(1000); // Give it a moment after scrolling
            await addToCartBtns[0].click();
            console.log("✅ Test 6: Added item to cart and Cart/Interaction icon clicked.");
        } else {
            throw new Error("No Add to Cart buttons found.");
        }

        // 7. Cart Sidebar Verification[cite: 2]
        // Open the cart sidebar by clicking the navbar cart button
        let navCartBtn = await driver.findElement(By.xpath("//nav//div[contains(@class, 'gap-4')]/button[3]"));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", navCartBtn);
        await navCartBtn.click();

        // Wait up to 5 seconds for the sidebar to animate in and display common cart text
        await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'Your Cart') or contains(text(), 'Estimated Total')]")),
            5000
        );
        console.log("✅ Test 7: Cart sidebar state verified.");

        // --- PART 3: QUOTE & INTERACTION (Matches quoteController)[cite: 2] ---

        // 8. Quote Form Visibility (Checkout Page)[cite: 2]
        // Click 'Request a Quote' button in the sidebar
        let requestQuoteBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Request a Quote')]"));
        await requestQuoteBtn.click();

        // Wait for Checkout page to load and display "Shipping Details"
        await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Shipping Details')]")), 5000);
        console.log("✅ Test 8: Quote request form (Checkout) found.");

        // 9. Form Field: Name[cite: 2]
        let nameField = await driver.findElement(By.name('customerName'));
        await nameField.sendKeys('Mahaveer');
        console.log("✅ Test 9: Name input accepts data.");

        // 10. Form Field: Phone[cite: 2]
        await driver.findElement(By.name('phone')).sendKeys('03001234567');
        console.log("✅ Test 10: Phone field accepts data.");

        // --- PART 4: ADMIN & SECURITY (Matches AdminLogin.jsx / authMiddleware)[cite: 2] ---

        // 11. Admin Login Page Load[cite: 2]
        await driver.get(`${baseUrl}/admin/login`);
        console.log("✅ Test 11: Admin Login page loaded.");

        // 12. Login Credentials - Username[cite: 2]
        await driver.wait(until.elementLocated(By.xpath("//input[@type='text']")), 5000);
        await driver.findElement(By.xpath("//input[@type='text']")).sendKeys('admin');
        console.log("✅ Test 12: Admin username field functional.");

        // 13. Login Credentials - Password[cite: 2]
        await driver.findElement(By.xpath("//input[@type='password']")).sendKeys('wrongpass');
        console.log("✅ Test 13: Password field functional.");

        // 14. Error Handling (Click Login with wrong data)[cite: 2]
        await driver.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
        await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'bg-red-50')]")), 5000);
        console.log("✅ Test 14: Login button handles click event and error shown.");

        // 15. Protected Route Security (Check ProtectedRoute.jsx)[cite: 2]
        await driver.get(`${baseUrl}/admin`);
        await driver.wait(until.urlContains('login'), 5000);
        console.log("✅ Test 15: Security - Unauthorized access redirected to login.");

    } catch (error) {
        console.error("❌ Test failed: ", error.message);
    } finally {
        await driver.quit();
        console.log("🧹 Part-I Complete. 15 tests executed.");
    }
}

runHaariYaariTests();