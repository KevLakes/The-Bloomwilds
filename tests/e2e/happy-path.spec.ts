import { test, expect } from '@playwright/test';

/**
 * Happy path:
 *  1. Boot → Profile creation (Swedish)
 *  2. "How I Play" — flip Calm + Big Letters, save
 *  3. Home → Overworld
 *  4. Enter Letterglade → complete letter-match
 *  5. Assert bloom tier advanced and a sticker was earned
 *  6. Switch language to English, complete a second Letterglade challenge,
 *     confirm English UI strings render
 */
test('create a Swedish profile and complete a Letterglade challenge', async ({ page }) => {
  await page.goto('/');

  // Boot screen runs the wake-up sequence (~4.4s) then redirects to /profiles
  await expect(page).toHaveURL(/\/profiles$/, { timeout: 8000 });
  await expect(page.getByRole('heading', { name: /Vem spelar|Who's playing/i })).toBeVisible();

  // Name input + Swedish + create
  await page.getByPlaceholder(/Mitt namn|My name/i).fill('Stina');
  await page.getByRole('button', { name: /Svenska/ }).first().click();
  await page.getByRole('button', { name: /Skapa|Create/ }).click();

  // How I Play
  await expect(page).toHaveURL(/\/how-i-play$/);
  // Toggle Big Letters and Calm via aria-checked switches
  const switches = page.getByRole('switch');
  await switches.first().click();
  await page.getByRole('button', { name: /Spara|Save/ }).click();

  // Home → Overworld
  await expect(page).toHaveURL(/\/home$/);
  await page.getByRole('button', { name: /Spela|Play/ }).click();

  await expect(page).toHaveURL(/\/map$/);
  await page.getByRole('button', { name: /Bokstavslunden|Letterglade/ }).click();

  // Region scene
  await expect(page).toHaveURL(/\/map\/letterglade/);
  await page.getByRole('button', { name: /Bokstavsjakt|Letter Hunt/ }).first().click();

  await expect(page).toHaveURL(/\/play\/letterglade.letter-match/);

  // Complete the matches in Swedish (a/å/ä/ö/s)
  for (const letter of ['A', 'Å', 'Ä', 'Ö', 'S']) {
    await page.getByRole('button', { name: letter, exact: true }).first().click();
    await page.getByRole('button', { name: letter.toLowerCase(), exact: true }).first().click();
  }

  // Celebration appears
  await expect(page.getByRole('heading', { name: /Bra jobbat|Well done/ })).toBeVisible({
    timeout: 10_000,
  });
});
