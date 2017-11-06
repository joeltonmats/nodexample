import { ContAppPage } from './app.po';

describe('cont-app App', function() {
  let page: ContAppPage;

  beforeEach(() => {
    page = new ContAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
