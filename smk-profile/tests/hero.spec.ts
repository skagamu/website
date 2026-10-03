import { expect, test } from "@playwright/test";

test("pause/resume preserves timeline and controls video; navigation wraps", async ({ page }) => {
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Jeda slideshow" });
  await expect(pause).toBeEnabled();
  await expect.poll(() => page.locator("video").evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true);
  await pause.click();
  const read = () => page.locator(".origin-left").evaluate((el) => getComputedStyle(el).transform);
  const pausedProgress = await read();
  await page.waitForTimeout(400);
  expect(await read()).toBe(pausedProgress);
  expect(await page.locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.getByRole("button", { name: "Putar slideshow" }).click();
  await expect.poll(read).not.toBe(pausedProgress);
  await page.getByRole("button", { name: "Jeda slideshow" }).click();
  await page.getByRole("button", { name: "Slide sebelumnya" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Mulai dari rasa ingin tahu.");
  await page.getByRole("button", { name: "Slide berikutnya" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Siap berkarya.");
});

test("autoplay follows duration and resets for the next slide", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Jeda slideshow" })).toBeEnabled();
  await page.clock.runFor(16000);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Temukan potensimu.");
  await page.clock.runFor(8500);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Mulai dari rasa ingin tahu.");
});

test("reduced motion and keyboard navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Gerakan otomatis dinonaktifkan" })).toBeDisabled();
  await page.getByRole("link", { name: "Daftar PPDB" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Temukan potensimu.");
  await expect(page.getByRole("link", { name: "Daftar PPDB" })).toBeFocused();
});

for (const width of [320, 375, 768, 1280, 1440]) {
  test(`layout and touch targets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 812 : 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const layout = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
    expect(layout.content).toBe(layout.width);
    for (const button of await page.getByRole("button").all()) {
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(48);
      expect(box?.height).toBeGreaterThanOrEqual(48);
    }
    for (const link of await page.getByRole("link").all()) {
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    }
    await page.screenshot({ path: `test-results/hero-${width}.png`, fullPage: true });
  });
}
