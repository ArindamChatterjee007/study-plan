import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';

// Simple in-memory forwarder: when page posts to /api/admin (call_signal), forward to the other page via its __handleTestEvent
async function setupSignalForwarding(page, otherPage) {
  await page.route('**/api/admin', async (route) => {
    const req = route.request();
    const post = req.postData() || '{}';
    let body = {};
    try { body = JSON.parse(post); } catch (e) { body = {}; }
    // Build an event object similar to what server would deliver
    const event = {
      signalType: body.signalType || body.payload?.signalType || '',
      callId: body.callId || (body.payload && body.payload.callId) || '',
      memberId: body.memberId || '',
      fromRole: body.fromRole || body.from_role || 'member',
      payload: body.payload || {},
      sessionId: body.sessionId || '',
      fromName: body.memberName || '',
    };
    // Forward to other page
    try {
      await otherPage.evaluate((e) => {
        // call the test hook
        if (window.__handleTestEvent) {
          window.__handleTestEvent(e);
        }
      }, event);
    } catch (err) {
      // ignore
    }
    // Respond success to the caller
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, resolvedMemberId: body.memberId || '' }) });
  });
}

test('push-to-talk request/accept flow (headless)', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['microphone'] });
  const pageA = await context.newPage();
  const pageB = await context.newPage();

  // Set up forwarding both ways
  await setupSignalForwarding(pageA, pageB);
  await setupSignalForwarding(pageB, pageA);

  await pageA.goto(APP_URL, { waitUntil: 'networkidle' });
  await pageB.goto(APP_URL, { waitUntil: 'networkidle' });

  // Ensure unique member names so signaling includes memberName
  await pageA.evaluate(() => localStorage.setItem('member_name', 'Alice'));
  await pageB.evaluate(() => localStorage.setItem('member_name', 'Bob'));

  // Reload to pick up names
  await pageA.reload({ waitUntil: 'networkidle' });
  await pageB.reload({ waitUntil: 'networkidle' });

  // Wait for UI to be interactive
  await pageA.waitForSelector('textarea[placeholder="Send your message..."]');
  await pageB.waitForSelector('textarea[placeholder="Send your message..."]');

  // Click push-to-talk on A (member button)
  const pttSelectorA = 'button[title*="walkie-talkie"], button[title*="Hold to talk"], button[title*="Hold to talk (walkie-talkie)"]';
  await pageA.click(pttSelectorA);

  // A should show 'Requesting to talk...'
  await expect(pageA.locator('text=Requesting to talk...')).toBeVisible({ timeout: 5000 });

  // On B, the Talk Request UI should appear. Click Accept
  const acceptButton = pageB.locator('text=Accept');
  await expect(acceptButton).toBeVisible({ timeout: 5000 });
  await acceptButton.click();

  // A should show accepted notice
  await expect(pageA.locator('text=Talk request accepted')).toBeVisible({ timeout: 5000 });

  // Release PTT on A (simulate pointerup)
  await pageA.dispatchEvent(pttSelectorA, 'pointerup');

  // A should show notice 'Talk request timed out' or 'Talk request ended' or similar 'Call notice' change
  // Wait a short while for ptt:end to process
  await pageA.waitForTimeout(500);

  await context.close();
});
