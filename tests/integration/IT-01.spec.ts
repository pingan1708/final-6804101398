
import { test, expect } from '@playwright/test';

test('IT-01: top-down REAL Login -> browser-level Inventory STUB', {
  annotation: {
    type: 'description',
    description: 'ทดสอบ Login จริงร่วมกับ Inventory Stub ที่จำลองด้วย page.setContent()'
  }
}, async ({ page }) => {

  await test.step('Login ผ่านหน้าเว็บไซต์จริง', async () => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="username"]')
      .fill('standard_user');

    await page.locator('[data-test="password"]')
      .fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    // ตรวจสอบว่า Login สำเร็จและเข้าสู่ Inventory
    await expect(page).toHaveURL(/inventory\.html/);
  });

  await test.step('สร้าง Inventory Stub', async () => {
    // จำลองหน้า Inventory ด้วย HTML
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Inventory Stub</title>
        </head>
        <body>
          <h1>Mock Inventory Ready</h1>

          <div data-test="inventory-list">
            <div class="inventory-item">
              <span class="inventory-item-name">Mock Backpack</span>
            </div>

            <div class="inventory-item">
              <span class="inventory-item-name">Mock Bike Light</span>
            </div>
          </div>
        </body>
      </html>
    `);
  });

  await test.step('ตรวจสอบผลจาก Stub', async () => {
    // ตรวจสอบข้อความบนหน้า Stub
    await expect(
      page.getByRole('heading', { name: 'Mock Inventory Ready' })
    ).toBeVisible();

    // ตรวจสอบจำนวนสินค้าจำลอง
    await expect(
      page.locator('.inventory-item')
    ).toHaveCount(2);

    // ตรวจสอบชื่อสินค้าจำลองรายการที่ 1
    await expect(
      page.getByText('Mock Backpack', { exact: true })
    ).toBeVisible();

    // ตรวจสอบชื่อสินค้าจำลองรายการที่ 2
    await expect(
      page.getByText('Mock Bike Light', { exact: true })
    ).toBeVisible();
  });

});
