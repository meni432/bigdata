import { BigfinalclientPage } from './app.po';

describe('bigfinalclient App', () => {
  let page: BigfinalclientPage;

  beforeEach(() => {
    page = new BigfinalclientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
