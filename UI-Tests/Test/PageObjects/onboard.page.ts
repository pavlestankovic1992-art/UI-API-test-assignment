class OnboardPage {
  open() { return browser.url('/onboard'); }

  private get newWalletButton() { return $('button*=I need a new wallet'); }
  private get savedRecoveryPhraseButton() { return $('button*=I saved my recovery phrase'); }
  private get continueButton() { return $('button*=Continue'); }
  private get recoverySection() { return $('[data-testid="section-mnemonic-field"]'); }


  async clickNewWallet() {
    await this.newWalletButton.waitForClickable({ timeout: 15000 });
    await this.newWalletButton.click();
  }


  async readRecoveryPhraseWords(expected = 12): Promise<string[]> {
    await this.recoverySection.waitForDisplayed({ timeout: 15000 });
    const inputs = this.recoverySection.$$('[data-testid^="input-recovery-phrase-"]');
    if ((await inputs.length) < expected) throw new Error('Not enough recovery words');

    const words: string[] = [];
    for (let i = 0; i < expected; i++) {
      const w = await inputs[i].getValue();
      if (!w) throw new Error(`Word ${i + 1} empty`);
      words.push(w.toLowerCase());
    }
    return words;
  }


    async clickSavedRecoveryPhrase() {
    await this.savedRecoveryPhraseButton.waitForClickable({ timeout: 15000 });
    await this.savedRecoveryPhraseButton.click();
  }

  
  async fillAllConfirmRecoveryPhrase(words: string[]) {
    if (words.length < 12) throw new Error('Need 12 recovery words');
    await this.recoverySection.waitForDisplayed({ timeout: 15000 });

    const inputs = this.recoverySection.$$('input[type="text"]');
   const count = await inputs.length;

    if (count < 12) throw new Error('Not enough confirm inputs');


    for (let i = 0; i < 12; i++) {
      await inputs[i].scrollIntoView();
      await inputs[i].setValue(words[i]);
    }
  }


  async clickContinue() {
    await this.continueButton.waitForClickable({ timeout: 15000 });
    await this.continueButton.click();
  }


}

export default new OnboardPage();
