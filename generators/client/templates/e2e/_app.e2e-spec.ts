import { AppMasterdataAccountPage } from './app.po';

describe('app-masterdata-account App', function() {
  let page: AppMasterdataAccountPage;

  beforeEach(() => {
    page = new AppMasterdataAccountPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
