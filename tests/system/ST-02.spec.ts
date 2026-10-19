
import { test, expect } from '@playwright/test';

test('ST-02: checkout validation and recovery', {
  annotation: {
    type: 'description',
    description: 'ตรวจสอบ Checkout Validation และการแก้ไขข้อมูลจนสั่งซื้อสำเร็จ'
  }
}, async ({ page }) => {

  await test.step('Login เพิ่มสินค้า และเปิด Checkout', async () => {
    // เปิดเว็บไซต์ SauceDemo
    await page.goto('https://www.saucedemo.com/');

    // Login ด้วยบัญชีที่กำหนด
    await page.locator('[data-test="username"]')
      .fill('standard_user');

    await page.locator('[data-test="password"]')
      .fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    // ตรวจสอบ Inventory
    await expect(page).toHaveURL(/inventory\.html/);

    // เพิ่มสินค้า 2 รายการ
    await page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    ).click();

    await page.locator(
      '[data-test="add-to-cart-sauce-labs-bike-light"]'
    ).click();

    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('2');

    // เปิด Shopping Cart และ Checkout
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  await test.step('ตรวจสอบ First Name is required', async () => {
    // ส่งฟอร์มโดยไม่กรอกข้อมูล
    await page.locator('[data-test="continue"]').click();

    // ตรวจสอบข้อความ Error
    await expect(
      page.locator('[data-test="error"]')
    ).toContainText('Error: First Name is required');

    // ต้องไม่เข้าสู่ Checkout Overview
    await expect(page).not.toHaveURL(/checkout-step-two\.html/);
  });

  await test.step('ตรวจสอบ Last Name is required', async () => {
    // กรอก First Name แต่ไม่กรอก Last Name
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="continue"]').click();

    // ตรวจสอบข้อความ Error
    await expect(
      page.locator('[data-test="error"]')
    ).toContainText('Error: Last Name is required');

    // ต้องไม่เข้าสู่ Checkout Overview
    await expect(page).not.toHaveURL(/checkout-step-two\.html/);
  });

  await test.step('ตรวจสอบ Postal Code is required', async () => {
    // กรอก First Name และ Last Name แต่ไม่กรอก Postal Code
    await page.locator('[data-test="lastName"]').fill('Student');
    await page.locator('[data-test="continue"]').click();

    // ตรวจสอบข้อความ Error
    await expect(
      page.locator('[data-test="error"]')
    ).toContainText('Error: Postal Code is required');

    // ต้องไม่เข้าสู่ Checkout Overview
    await expect(page).not.toHaveURL(/checkout-step-two\.html/);
  });

  await test.step('แก้ไขข้อมูลและสั่งซื้อสำเร็จ', async () => {
    // กรอก Postal Code ให้ครบ
    await page.locator('[data-test="postalCode"]').fill('10110');

    // กด Continue
    await page.locator('[data-test="continue"]').click();

    // ตรวจสอบว่าเข้าสู่ Checkout Overview
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // ตรวจสอบสินค้าทั้งสองรายการ
    await expect(
      page.locator('.cart_item')
    ).toHaveCount(2);

    await expect(
      page.locator('.inventory_item_name')
    ).toContainText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light'
    ]);

    // กด Finish เพื่อสั่งซื้อ
    await page.locator('[data-test="finish"]').click();

    // ตรวจสอบหน้าสั่งซื้อสำเร็จ
    await expect(page).toHaveURL(/checkout-complete\.html/);

    await expect(
      page.getByText('Thank you for your order!', {
        exact: true
      })
    ).toBeVisible();
  });

});
