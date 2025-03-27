import { expect, Page } from '@playwright/test';
const data = require("../../TestData/testdata.json");
import { pageFixture } from "../../HooksHelper/pageFixture";
let TIMEOUT = 50*1000

export class LoginPage {
     constructor(private page:Page) {}
       
        private readonly emailAddressInputFieldLoginAuth0 = '//input[@name="user-name"]'
        private readonly passwordInputFieldAuth0 = '//input[@name="password"]'
        private readonly loginVerifyButton = '//input[@name="login-button"]'

    async gotoUrl(pageFixture){     
        await pageFixture.page.goto(data.url);
    }

    async loginAsRegisteredUser(pageFixture, username, password) {
        await expect(pageFixture.page.locator(this.emailAddressInputFieldLoginAuth0)).toBeVisible({timeout : TIMEOUT});
        await pageFixture.page.locator(this.emailAddressInputFieldLoginAuth0).fill(username);
        await expect(pageFixture.page.locator(this.passwordInputFieldAuth0)).toBeVisible({timeout : TIMEOUT});
        await pageFixture.page.locator(this.passwordInputFieldAuth0).fill(password);
        await expect(pageFixture.page.locator(this.loginVerifyButton)).toBeVisible({timeout : TIMEOUT});
        await pageFixture.page.locator(this.loginVerifyButton).click();
        console.log("User login successfully!")
    }
}