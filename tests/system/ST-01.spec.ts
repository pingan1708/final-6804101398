
import { test, expect } from '@playwright/test';

test('ST-01: complete purchase of two products', {
  annotation: {
    type: 'description',
    description: 'ทดสอบการซื้อ Backpack และ Bike Light ตั้งแต่ Login จนสั่งซื้อสำเร็จ'
  }
}, async ({ page }) => {

  await test.step('Login และตรวจสอบ Inventory', async () => {
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

  await test.step('เพิ่มสินค้าสองรายการ', async () => {
    // เพิ่ม Sauce Labs Backpack
    await page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    ).click();

    // เพิ่ม Sauce Labs Bike Light
    await page.locator(
      '[data-test="add-to-cart-sauce-labs-bike-light"]'
    ).click();

    // ตรวจสอบ Cart Badge = 2
    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('2');
  });

  await test.step('ตรวจสอบ Cart', async () => {
    // เปิด Shopping Cart
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart\.html/);

    // ตรวจสอบจำนวนสินค้า
    await expect(
      page.locator('.cart_item')
    ).toHaveCount(2);

    // ตรวจสอบชื่อสินค้าทั้งสองรายการ
    await expect(
      page.locator('.inventory_item_name')
    ).toContainText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light'
    ]);
  });

  await test.step('กรอก Checkout Information', async () => {
    // คลิก Checkout
    await page.locator('[data-test="checkout"]').click();

    // ตรวจสอบหน้า Checkout Information
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // กรอกข้อมูลลูกค้า
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('Student');
    await page.locator('[data-test="postalCode"]').fill('10110');

    // คลิก Continue
    await page.locator('[data-test="continue"]').click();

    // ตรวจสอบว่าเข้าสู่ Checkout Overview
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  await test.step('ตรวจสอบ Overview และสั่งซื้อ', async () => {
    // ตรวจสอบสินค้าทั้งสองรายการใน Overview
    await expect(
      page.locator('.cart_item')
    ).toHaveCount(2);

    await expect(
      page.locator('.inventory_item_name')
    ).toContainText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light'
    ]);

    // คลิก Finish เพื่อยืนยันคำสั่งซื้อ
    await page.locator('[data-test="finish"]').click();

    // ตรวจสอบว่าเข้าสู่หน้าสั่งซื้อสำเร็จ
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  await test.step('ตรวจสอบ Order Complete', async () => {
    // ตรวจสอบข้อความยืนยันคำสั่งซื้อ
    await expect(
      page.getByText('Thank you for your order!', {
        exact: true
      })
    ).toBeVisible();
  });

});
