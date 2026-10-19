
import { test, expect } from '@playwright/test';

test('UT-02: product button state Add to cart -> Remove -> Add to cart', {
  annotation: {
    type: 'description',
    description: 'ตรวจสอบสถานะปุ่ม Add to cart และ Remove รวมถึง Cart Badge'
  }
}, async ({ page }) => {

  await test.step('Login เข้าสู่ระบบ', async () => {
    // เปิดเว็บไซต์ SauceDemo
    await page.goto('https://www.saucedemo.com/');

    // กรอก Username และ Password
    await page.locator('[data-test="username"]')
      .fill('standard_user');

    await page.locator('[data-test="password"]')
      .fill('secret_sauce');

    // คลิก Login
    await page.locator('[data-test="login-button"]').click();

    // ตรวจสอบว่าเข้าสู่ Inventory สำเร็จ
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(
      page.locator('.inventory_item')
    ).toHaveCount(6);
  });

  await test.step('ตรวจสอบปุ่มก่อนเพิ่มสินค้า', async () => {
    // ตรวจสอบว่าปุ่ม Backpack เป็น Add to cart
    await expect(
      page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    ).toBeVisible();

    await expect(
      page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    ).toHaveText('Add to cart');

    // ตรวจสอบว่ายังไม่มี Cart Badge
    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveCount(0);
  });

  await test.step('เพิ่มสินค้าเข้า Cart', async () => {
    // เพิ่ม Sauce Labs Backpack
    await page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    ).click();

    // ตรวจสอบว่าปุ่มเปลี่ยนเป็น Remove
    await expect(
      page.locator('[data-test="remove-sauce-labs-backpack"]')
    ).toBeVisible();

    await expect(
      page.locator('[data-test="remove-sauce-labs-backpack"]')
    ).toHaveText('Remove');

    // ตรวจสอบ Cart Badge = 1
    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('1');
  });

  await test.step('ลบสินค้าออกจาก Cart', async () => {
    // คลิก Remove
    await page.locator(
      '[data-test="remove-sauce-labs-backpack"]'
    ).click();

    // ตรวจสอบว่าปุ่มกลับเป็น Add to cart
    await expect(
      page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    ).toBeVisible();

    await expect(
      page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    ).toHaveText('Add to cart');

    // ตรวจสอบว่า Cart Badge หายไปเมื่อไม่มีสินค้า
    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveCount(0);
  });

});
