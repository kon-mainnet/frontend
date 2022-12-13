import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';

import TxDetails from './TxDetails';

const API_URL = '/node-api/transactions/1';
const hooksConfig = {
  router: {
    query: { id: 1 },
  },
};

test('between addresses +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txMock.base),
  }));

  const component = await mount(
    <TestApp>
      <TxDetails/>
    </TestApp>,
    { hooksConfig },
  );

  await page.waitForResponse(API_URL);
  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});

test('creating contact', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txMock.withContractCreation),
  }));

  const component = await mount(
    <TestApp>
      <TxDetails/>
    </TestApp>,
    { hooksConfig },
  );
  await page.waitForResponse(API_URL);

  await expect(component).toHaveScreenshot();
});

test('with token transfer +@mobile', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txMock.withTokenTransfer),
  }));

  const component = await mount(
    <TestApp>
      <TxDetails/>
    </TestApp>,
    { hooksConfig },
  );
  await page.waitForResponse(API_URL);

  await expect(component).toHaveScreenshot();
});

test('with decoded revert reason', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txMock.withDecodedRevertReason),
  }));

  const component = await mount(
    <TestApp>
      <TxDetails/>
    </TestApp>,
    { hooksConfig },
  );
  await page.waitForResponse(API_URL);

  await expect(component).toHaveScreenshot();
});

test('with decoded raw reason', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txMock.withRawRevertReason),
  }));

  const component = await mount(
    <TestApp>
      <TxDetails/>
    </TestApp>,
    { hooksConfig },
  );
  await page.waitForResponse(API_URL);

  await expect(component).toHaveScreenshot();
});

test('pending', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(txMock.pending),
  }));

  const component = await mount(
    <TestApp>
      <TxDetails/>
    </TestApp>,
    { hooksConfig },
  );
  await page.waitForResponse(API_URL);
  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});