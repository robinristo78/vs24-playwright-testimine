// @ts-check
import { test, expect } from '@playwright/test';

const voco = 'https://voco.ee'

test('Leia VS24 Tunniplaan ja tee pilt', async ({ page}) => {
  // 1. Mine voco.ee
  await page.goto(voco);

  // 2. Vajuta Tunniplaan lingile
  await page.getByRole('link', { name: 'Tunniplaan' }).click();
  await page.waitForTimeout(1000);

  // 3. Kirjuta 'VS24' kursuse otsingukasti
  const select2Dropdown = page.locator('a.select2-choice');
  await select2Dropdown.click();

  const select2Input = page.locator('input.select2-input');
  await select2Input.fill('VS24');
  await select2Input.press('Enter');

  const calendar = page.locator('div.lessonsCalendar_calendar');
  await expect(calendar).toBeVisible();

  // 4. Tee pilt tunniplaanist
  await page.mouse.move(0, 0);
  await calendar.screenshot({ path: 'pictures/VS24_tunniplaan.png' });
})

test('Viimase uudise artikli avaldamise kuupäev', async ({ page }) => {
  // 1. Mine voco.ee
  await page.goto(voco);

  // 2. Vajuta 'Kõik uudised' lingile
  await page.getByRole('link', { name: "Kõik uudised" }).click();
  await page.waitForTimeout(1000);

  // 3. Ava esimeselt ilmuva uudise peale.
  const postsContainer = page.locator('div.row.u-verticalSpacingAll');
  await postsContainer.waitFor();

  const firstPostRead = postsContainer.locator('article.postPreview').first().locator('a.postPreview_more');
  await firstPostRead.click();
  await page.waitForTimeout(1000);

  // 4. Leia artikli avaldamis kuupäeva
  const published = await page.locator('div.postMeta').first();

  // 5. Väljasta konsooli ning tee pilt
  console.log(published.innerText());
  await published.screenshot({ path: 'pictures/latest_published_article_date.png' });

})

test('Leia akadeemilise kalenderi dokument', async ({ page }) => {
  // 1. Mine voco.ee
  await page.goto(voco);

  // 2. Vajuta "Üldinfo" lingile
  await page.getByRole('link', { name: "Üldinfo" }).click();
  await page.waitForTimeout(1000);

  // 4. Leia ja vajuta "Dokumendid" lingile
  await page.locator('#menu-item-1818').click();
  await page.waitForTimeout(1000);

  await page.locator('#menu-item-70077 > a').click()
  await page.waitForTimeout(1000);

  // 5. Leia akadeemilise kalendri dokumendi tabelist
  const kalender = page.locator('table:has-text("akadeemiline kalender") tbody tr').first();
  await expect(kalender).toBeVisible();

  // 6. Prindi konsooli akadeemilise kalendri rea
  const text = await kalender.innerText();
  console.log(text);
})