import OnboardPage from '../PageObjects/onboard.page';
import SetupPage from '../PageObjects/setup.page';
import PortfolioPage from '../PageObjects/portfolio.page';

describe('Solflare onboarding', () => {
  it('should create wallet', async () => {
    
    await OnboardPage.open();
    await OnboardPage.clickNewWallet();
    const words = await OnboardPage.readRecoveryPhraseWords(12);
    await OnboardPage.clickSavedRecoveryPhrase();
    await OnboardPage.fillAllConfirmRecoveryPhrase(words);
    await OnboardPage.clickContinue();
    await SetupPage.setPasswordAndConfirm('Test1234!');
    await SetupPage.clickContinue();
    await SetupPage.clickAgreeLetsGo();
    await PortfolioPage.openWalletManagement();
    await PortfolioPage.expectMainWalletVisible();
    await PortfolioPage.clickAddWallet();
    await PortfolioPage.clickManageRecoveryPhrase();
    await PortfolioPage.expectFirstToggleDisabled()
    await PortfolioPage.expectFirstToggleOn()
    await PortfolioPage.toggle3rdAnd4thOn()
    await PortfolioPage.clickSave();
    await PortfolioPage.expectRecoveryPhraseListContainsMainAndNewWallets();
  });
});
