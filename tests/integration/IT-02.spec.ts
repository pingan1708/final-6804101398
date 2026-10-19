
import { test, expect, BrowserContext, Page } from '@playwright/test';

// Driver เตรียมสถานะ Login ก่อนเปิด Inventory
async function driverOpenInventory(
  context: BrowserContext,
  page: Page
) {
  // กำหนด Cookie ตามข้อกำหนดของโจทย์
  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'Lax'
    }
  ]);

  // SauceDemo ใช้ localStorage สำหรับสถานะผู้ใช้
  // เตรียมสถานะก่อนหน้าเว็บจริงโหลด
  await context.addInitScript(() => {
    localStorage.setItem('session-username', 'standard_user');
  });

  // เปิด Inventory โดยตรง ไม่ผ่าน Login Form
  await page.goto('https://www.saucedemo.com/inventory.html');
}

test('IT-02: DRIVER login state -> REAL Inventory and Cart', {
  annotation: {
    type: 'description',
    description: 'ใช้ Driver เตรียมสถานะ Login เพื่อทดสอบ Inventory และ Cart จริง'
  }
}, async ({ browser }) => {

  // สร้าง BrowserContext แยกสำหรับ Test นี้
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await test.step('สร้าง Driver และเปิด Inventory', async () => {
      await driverOpenInventory(context, page);

      // ตรวจสอบว่าเข้าสู่ Inventory ได้
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(
        page.locator('.inventory_container')
      ).toBeVisible();
    });

    await test.step('ตรวจสอบ Inventory จริง', async () => {
      // ตรวจสอบว่ามีสินค้าทั้งหมด 6 รายการ
      await expect(
        page.locator('.inventory_item')
      ).toHaveCount(6);
    });

    await test.step('เพิ่มสินค้า 2 รายการ', async () => {
      // เพิ่ม Sauce Labs Backpack
      await page.locator(
        '[data-test="add-to-cart-sauce-labs-backpack"]'
      ).click();

      // เพิ่ม Sauce Labs Bike Light
      await page.locator(
        '[data-test="add-to-cart-sauce-labs-bike-light"]'
      ).click();

      // ตรวจสอบ Cart Badge เท่ากับ 2
      await expect(
        page.locator('.shopping_cart_badge')
      ).toHaveText('2');
    });

    await test.step('ตรวจสอบสินค้าใน Cart', async () => {
      // เปิดหน้า Shopping Cart จริง
      await page.locator('.shopping_cart_link').click();

      await expect(page).toHaveURL(/cart\.html/);

      // ตรวจสอบว่ามีสินค้า 2 รายการ
      await expect(
        page.locator('.cart_item')
      ).toHaveCount(2);

      // ตรวจสอบชื่อสินค้า
      await expect(
        page.locator('.inventory_item_name')
      ).toContainText([
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light'
      ]);
    });

  } finally {
    // ปิด BrowserContext แม้ Test จะเกิดข้อผิดพลาด
    await context.close();
  }

});
