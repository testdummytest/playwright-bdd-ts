import { expect, Page } from '@playwright/test';
import { pageFixture } from '../../HooksHelper/pageFixture';
import { sleep } from '../../utils/common';
let TIMEOUT = 50*1000

export class HomePage {
     constructor(private page:Page) {}
       
        private readonly verifySiteTitle = '//div[text()="Swag Labs"]'
        private readonly verifySideLabel = '//span[text()="Products"]'
        private readonly verifyFilter = '//select[@class="product_sort_container"]'
        private readonly verifyProduct = '//div[text()="Sauce Labs Backpack"]'
        private readonly verifyProductAddToCartButton = '//button[@name="add-to-cart"]'
        private readonly verifyCartBtn = '//div[@class="shopping_cart_container"]'
        private readonly verifyCheckoutBtn = '//button[@name="checkout"]'
        private readonly verifyHamburgerMenu = '//div[@class="bm-burger-buttontest"]'


    async verifyHomePage() {
        await expect(pageFixture.page.locator(this.verifySiteTitle)).toBeVisible({timeout : TIMEOUT});
        await expect(pageFixture.page.locator(this.verifySideLabel)).toBeVisible({timeout : TIMEOUT});
        await expect(pageFixture.page.locator(this.verifyFilter)).toBeVisible({timeout : TIMEOUT});
        console.log("Home page is verified")
    }

    async tapOnProductTitle(product){
        if(product === "Product"){
            await expect(pageFixture.page.locator(this.verifyProduct)).toBeVisible({timeout : TIMEOUT});
            await pageFixture.page.locator(this.verifyProduct).click();
        }
    }    
    
    async verifyAddtoCartBtnOnProductDetailPage(){
        await expect(pageFixture.page.locator(this.verifyProductAddToCartButton)).toBeVisible({timeout : TIMEOUT});
        await pageFixture.page.locator(this.verifyProduct).click();
    }
    
    async tapOnCartBtn(cart){
        if(cart === "Cart"){
            await expect(pageFixture.page.locator(this.verifyCartBtn)).toBeVisible({timeout : TIMEOUT});
            await pageFixture.page.locator(this.verifyCartBtn).click();
        }
    }  
    
    async verifyCheckoutBtnOncartPage(){
        await expect(pageFixture.page.locator(this.verifyCheckoutBtn)).toBeVisible({timeout : TIMEOUT});
        console.log("Verified checkout button on cart page")
    }

    async verifyMenushomepage(){
        await expect(pageFixture.page.locator(this.verifyHamburgerMenu)).toBeVisible({timeout : TIMEOUT});
        console.log("Verified Hamburger Menu")
    }
}
