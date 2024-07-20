import { test, expect, Locator, Page } from '@playwright/test';
import { locations } from './locationData';


test.use({

    locale: "pl-PL",
})


function getWeather (page: Page, daysFromToday: number) {

    const weatherElement = page.locator('ul.timelineList').locator(`[aria-label^="${daysFromToday} "]`)

    return weatherElement
}

function getTemp (wheater: Locator){

    return wheater.locator('.temperature').textContent()
}
 

test('should average daily temperature be over 22 degrees in Cracow everyday for next 3 days from Today', async ({ page }) => {
    
    await page.goto(locations.krakow)
    await expect(page).toHaveURL(/.*krakow/)
    await page.getByLabel('accept and close').click()

    let temperatures: string []  = []
   
    for (let i = 1; i<4; i++){

        const currentWeather = getWeather(page, i)
        const temperature = await getTemp(currentWeather)
            
        if (temperature) {  
            temperatures.push(temperature.trim().slice(0,2))     
            }    
    } 
    
    console.log(temperatures)
    let sum = 0;

    temperatures.forEach(function(item) {
            
        sum += parseInt(item);
    });
    
    const average = sum / temperatures.length;
    const requiredAvg: number = 22

    expect(average).toBeGreaterThan(requiredAvg)
});

test('should average daily temperature be below 42 degrees in Poznan on next Wednesday', async ({ page }) => {

    await page.goto(locations.poznan)
    await expect(page).toHaveURL(/.*poznan/)
    await page.getByLabel('accept and close').click()

    const firstWed = page.locator('ul.timelineList > li').filter({hasText: 'Śr'}).first()
  
    let tempExtremum: string []  = []
       
    const temperature = await getTemp(firstWed)
            
        if (temperature) {  
            tempExtremum.push(temperature.trim().slice(0,2))
            tempExtremum.push(temperature.trim().slice(3,5))     
            }    
    
    console.log(tempExtremum)

    let sum = 0;

    tempExtremum.forEach(function(item) {
            
        sum += parseInt(item);
    });
    
    const average = sum / tempExtremum.length;
    const requiredAvg: number = 42

    expect(average).toBeLessThan(requiredAvg)
});

// test('should not average daily temperature differ more than 5 degrees for Szczecin and Cracow on next Monday', async ({ page }) => {

// });

// test('should average daily temperature for Cracow, Poznań and Szczecin be over 19 degrees on next Monday', async ({ page }) => {

// });