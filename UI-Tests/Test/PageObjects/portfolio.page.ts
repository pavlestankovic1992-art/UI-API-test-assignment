class PortfolioPage {


async openWalletManagement() {
  const avatar = await $('[data-testid="section-wallet-picker"] span');
  await avatar.waitForDisplayed({ timeout: 15000 });
  await avatar.click();
}

async expectMainWalletVisible() {
  await $('[data-testid="list-item-m-title"]=Main Wallet').waitForDisplayed({ timeout: 15000 });
}

async clickAddWallet() {
  const el = await $('[data-testid="list-item-m-title"]=Add wallet');
  await el.waitForDisplayed({ timeout: 15000 });
  await (await el.parentElement()).click();
}

async clickManageRecoveryPhrase() {
  await (await $('[data-testid="title"]=Manage recovery phrase').parentElement()).click();
}


private async getSwitchByIndex(index: number) {
  const items = $('*[data-testid="section-manage-recovery-phrase"]')
    .$$('[data-testid^="li-wallets-"]');

  const count = await items.length; 
  if (count <= index) throw new Error('Switch index out of range');

  return items[index].$('button[role="switch"]');
}

async expectFirstToggleDisabled() {
  await expect(await this.getSwitchByIndex(0)).toBeDisabled();
}


async expectFirstToggleOn() {
  await expect(await this.getSwitchByIndex(0)).toHaveAttribute('aria-checked', 'true');
}

async toggle3rdAnd4thOn() {
  for (const idx of [2, 3]) {
    const sw = await this.getSwitchByIndex(idx);
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'true');
  }
}

async clickSave() {
  await $('button*=Save').click();
}

async expectRecoveryPhraseListContainsMainAndNewWallets() {
  await $('*=My wallets').waitForDisplayed({ timeout: 15000 });

  const titles = await $$('[data-testid^="li-wallets-"] [data-testid="list-item-m-title"]')
    .map(el => el.getText());

  expect(titles.length).toBeGreaterThanOrEqual(3);
  expect(titles).toContain('Main Wallet');
  expect(titles).toContain('Wallet 2');
  expect(titles).toContain('Wallet 3');
}
}

export default new PortfolioPage();
