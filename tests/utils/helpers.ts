import { Page, Locator, expect } from '@playwright/test';
import { locations } from './locationData';

export function getWeather (page: Page, daysFromToday: number) {

    const weatherElement = page.locator('ul.timelineList').locator(`[aria-label^="${daysFromToday} "]`)

    return weatherElement
}

export function getTemp (wheater: Locator){

    return wheater.locator('.temperature').textContent()
}

export function getAverage (temperatures: string[]): number {

    let sum = 0;

    temperatures.forEach(function(item) {
            
        sum += parseInt(item);
    });
    
   return sum / temperatures.length
}

export async function pickCity(page: Page, cityname: string) {

    await page.goto(locations[`${cityname}`])
    await expect(page).toHaveURL(/.*[`${cityname}`]/)
}

export async function closeCookiesModal(page: Page) {

    await page.getByLabel('accept and close').click()
}