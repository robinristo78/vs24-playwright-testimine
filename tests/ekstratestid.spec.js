// @ts-check
import { test, expect } from '@playwright/test'

const siseveeb = 'https://siseveeb.voco.ee';

// Ül 1: VS24 tunniplaan
test('VS24 tunniplaan - ekraanipilt', async ({ page }) => {

    // 1. Leia tunniplaani leht
    await page.goto(siseveeb);

    const tunniplaani_nupp = page.locator('div.d-inline').nth(1);
    await expect(tunniplaani_nupp).toBeVisible();
    await tunniplaani_nupp.click();

    // 2. Leia vs24 kursuse lingi
    const vs24kursus = page.locator('span.plan_button_groups > a.plan_button_class_span_groups', { hasText: 'VS24' });
    await expect(vs24kursus).toBeVisible();
    await vs24kursus.click();

    // 3. Tee tunniplaanist pilt
    const tunniplaan = page.locator('div.fc-view-container');
    await expect(tunniplaan).toBeVisible();

    await tunniplaan.screenshot({ path: 'pictures/VS24_ekstra_tunniplaan.png' });
});

// Ül 2: Õpetajate tunniplaanid
test.describe.parallel('Õpetajate tunniplaanid', () => {
    const opetajad = ['Aly Valvas', 'Maret Vaabel', 'Max Frolov'];

    opetajad.forEach(opetaja => {
        test(`Õpetaja ${opetaja} tunniplaan`, async ({ page }) => {

            // 1. Leia tunniplaani leht
            await page.goto(siseveeb);

            const tunniplaani_nupp = page.locator('div.d-inline').nth(1);
            await expect(tunniplaani_nupp).toBeVisible();
            await tunniplaani_nupp.click();

            // 2. Ava õpetajate nimekirja
            const opetaja_tab = page.locator('#tabs_li-1-1');
            await expect(opetaja_tab).toBeVisible();
            await opetaja_tab.click();

            // 3. Muuda nimi "Eesnimi Perekonnanimi" → "Perekonnanimi, Eesnimi"
            const [eesnimi, perenimi] = opetaja.split(' ');
            const opSearch = `${perenimi}, ${eesnimi}`;

            // 4. Otsi õpetaja
            const opetajaLink = page.locator('span.plan_button_person > a.plan_button', { hasText: opSearch });
            await expect(opetajaLink).toBeVisible();
            await opetajaLink.click();

            // 3. Tee tunniplaanist pilt
            const tunniplaan = page.locator('div.fc-view-container');
            await expect(tunniplaan).toBeVisible();

            const path = `pictures/${eesnimi}_${perenimi}_ekstra_tunniplaan.png`;
            await tunniplaan.screenshot({ path: path });
        });
    });
});

// Ül 3: Erinevate locatoritega test
test('Erinevad locatorid', async ({ page }) => {
    // Leia tunniplaani leht
    await page.goto(siseveeb);

    const tunniplaani_nupp = page.locator('div.d-inline').nth(1);
    await expect(tunniplaani_nupp).toBeVisible();
    await tunniplaani_nupp.click();

    // getByRole
    const tunniplaanLink = page.getByRole('link', { name: 'Tunniplaan' });
    await expect(tunniplaanLink).toBeVisible();
    await tunniplaanLink.click();

    // Ava õpetajate nimekirja
    const opetaja_tab = page.locator('#tabs_li-1-1');
    await expect(opetaja_tab).toBeVisible();
    await opetaja_tab.click();

    // getByText
    const textElement = page.getByText('Vutt, Evely').nth(1);
    await expect(textElement).toBeVisible();
    await textElement.click();

    // getByTestId
    const testIdElement = page.getByTestId('calendar');
    await expect(testIdElement).toBeVisible();
});

/**
 * @param {string} leht
 * @param {import("playwright-core").Page} page
 */
async function performanceTest(leht, page) {
    const start = performance.now();

    await page.goto(leht);
    await page.waitForLoadState('load'); // ootab kuni kogu leht on laetud
    
    const end = performance.now();
    const loadTime = (end - start).toFixed(2);
    console.log(`Lehe {${leht}} laadimisaeg: ${loadTime} ms`);
}

// Ül 4: Lehe laadimisaja mõõtmine ---
test('Lehe laadimisaeg', async ({ page }) => {
    // 1. Siseveebi test
    await performanceTest(siseveeb, page)

    const vs24_tunniplaani_URL = 'https://siseveeb.voco.ee/veebivormid/tunniplaan/tunniplaan?oppegrupp=1954';

    await performanceTest(vs24_tunniplaani_URL, page);
});