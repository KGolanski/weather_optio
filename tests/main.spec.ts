import { test, expect } from '@playwright/test';
import { getWeather, getTemp, getAverage, pickCity, closeCookiesModal } from './utils/helpers';

test.use({
    locale: "pl-PL",
    launchOptions: {slowMo: 2000}
})

test('should average daily temperature be over 22 degrees in Cracow everyday for next 3 days from Today', async ({ page }) => {

    pickCity(page, 'krakow')
    closeCookiesModal(page)

    let temperatures: string []  = []
   
    for (let i = 1; i<4; i++){

        const currentWeather = getWeather(page, i)
        const temperature = await getTemp(currentWeather)
            
        if (temperature) {  
            temperatures.push(temperature.trim().slice(0,2))     
            }    
    } 
        
    const average = getAverage(temperatures)    
    const requiredAvg: number = 22

    expect(average).toBeGreaterThan(requiredAvg)
});

test('should average daily temperature be below 42 degrees in Poznan on next Wednesday', async ({ page }) => {

    pickCity(page,'poznan')    

    await page.getByLabel('accept and close').click()

    const firstWed = page.locator('ul.timelineList > li').filter({hasText: 'Śr'}).first()
  
    let temperatures: string []  = []
       
    const temperature = await getTemp(firstWed)
            
        if (temperature) {  
            temperatures.push(temperature.trim().slice(0,2))
            temperatures.push(temperature.trim().slice(3,5))     
            }    
    
    const average = getAverage(temperatures)  
    const requiredAvg: number = 42

    expect(average).toBeLessThan(requiredAvg)
});

test('should not average daily temperature differ more than 5 degrees for Szczecin and Cracow on next Monday', async ({ page }) => {

    const cities = ['szczecin', 'krakow']
    const day = 'pn'
    
    let averages: number []  = []

    for (const index in cities){
    
        pickCity(page, cities[index])
        closeCookiesModal(page)

        let temperatures: string []  = []

        const expectedDay = page.locator('ul.timelineList > li').filter({hasText:`${day}`}).first()
        
        const temperature = await getTemp(expectedDay)
                
            if (temperature) {  
                temperatures.push(temperature.trim().slice(0,2))
                temperatures.push(temperature.trim().slice(3,5))     
                }    

        let average: number = getAverage(temperatures)  
        averages.push(average)
    }

    const requirement: number = (averages[0] - averages[1])
    expect(Math.abs(requirement)).toBeLessThan(5)
});
 
test('should average daily temperature for Cracow, Poznań and Szczecin be over 19 degrees on next Monday', async ({ page }) => {
    
    const cities = ['szczecin', 'krakow', 'poznan']
    const day = 'pn'
    
    let averages: number []  = []

    for (const index in cities){
    
        pickCity(page, cities[index])
        closeCookiesModal(page)

        let temperatures: string []  = []

        const expectedDay = page.locator('ul.timelineList > li').filter({hasText:`${day}`}).first()
        
        const temperature = await getTemp(expectedDay)
                
            if (temperature) {  
                temperatures.push(temperature.trim().slice(0,2))
                temperatures.push(temperature.trim().slice(3,5))     
                }    

        let average: number = getAverage(temperatures)  
        averages.push(average)
    }

    console.log(averages)
    const requirement: boolean = averages.every(temp =>{return temp > 19});
    
    console.log(requirement)
    expect(requirement).toBe(true)
});