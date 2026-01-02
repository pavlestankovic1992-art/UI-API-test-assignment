class SetupPage {

  private get continueButton() {
    return $('button*=Continue');
  }

  private get agreeButton() {
    return $('button*=I agree');
  }


  async setPasswordAndConfirm(pwd: string) {
    const fields = await $$('input[type="password"]');
    const count = await fields.length;

    if (count < 2) {
      throw new Error(`Expected 2 password inputs, found ${count}`);
    }

    await fields[0].waitForDisplayed({ timeout: 15000 });
    await fields[0].setValue(pwd);

    await fields[1].waitForDisplayed({ timeout: 15000 });
    await fields[1].setValue(pwd);
}

  async clickContinue() {
    await this.continueButton.waitForClickable({ timeout: 15000 });
    await this.continueButton.click();
  }

  async clickAgreeLetsGo() {
    await this.agreeButton.waitForClickable({ timeout: 15000 });
    await this.agreeButton.click();
  }
}

export default new SetupPage();
