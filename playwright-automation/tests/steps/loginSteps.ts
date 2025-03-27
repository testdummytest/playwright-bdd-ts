import {LoginPage} from '../pageobjects/loginPage';
import {Given, When, Then, setDefaultTimeout} from '@cucumber/cucumber';
import { pageFixture } from "../../HooksHelper/pageFixture";
import { getTestDataValue } from '../../utils/testDataReader';
setDefaultTimeout(60*1000*2);
let loginPage = new LoginPage(pageFixture.page);

Given('user open the saucelab url', async function () {
  await loginPage.gotoUrl(pageFixture);  
});

When('user login with {string} and {string} for register user', async function (username, password) {
  username = await getTestDataValue(username)
  password = await getTestDataValue(password)
  await loginPage.loginAsRegisteredUser(pageFixture, username, password);   
});


