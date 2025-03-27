import {HomePage} from '../pageobjects/homePage';
import {Given, When, Then, setDefaultTimeout} from '@cucumber/cucumber';
import { pageFixture } from "../../HooksHelper/pageFixture";
setDefaultTimeout(60*1000*2);
let homePage = new HomePage(pageFixture.page);



Then('user verify swaglabs home page titles', async function () {
    await homePage.verifyHomePage();   
    });

Then('user tap on {string} title', async function (product) {
    await homePage.tapOnProductTitle(product);   
    });
  
Then('user verify add to cart on product detail page', async function () {
    await homePage.verifyAddtoCartBtnOnProductDetailPage();   
    });

Then('user tap on {string} button from product detail page', async function (cart) {
    await homePage.tapOnCartBtn(cart);   
    });

Then('user verify checkout on cart page', async function () {
    await homePage.verifyCheckoutBtnOncartPage();   
    });

Then('user verify hamburger menu', async function () {
    await homePage.verifyMenushomepage();   
    });
