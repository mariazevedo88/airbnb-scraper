const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

let browser;

async function scrapeHomesInIndexPage(url){
    try{
        const page = await browser.newPage();
        await page.goto(url);
        
        const html = await page.evaluate(() => document.body.innerHTML);
        const $ = await cheerio.load(html);
        
        const homes = $("[itemprop='url']")
        .map((i, element) => "https://" + $(element).attr("content"))
        .get();
        return homes;
    } catch (e){
        console.error(e);
    }
}

async function scrapeDescriptionPage(url, page){
    try{
        await page.goto(url, {waitUntil: "networkidle2"});

        const html = await page.evaluate(() => document.body.innerHTML);
        const $ = await cheerio.load(html);
        const pricePerNight = 
            $("#room > div._mwt4r90 > div > div._2h22gn > div._1av41w02 > div > div > div._gor68n > div > div > div:nth-child(1) > div > div > div > div > div._10ejfg4u > div > div > div:nth-child(1) > span > div > div > span._tw4pe52 > span").text();
        console.log(pricePerNight);
    } catch (e){
        console.error(e);
    }
}

async function main(){
    browser = await puppeteer.launch({ headless: false });
    const descriptionPage = await browser.newPage();
    const homes = await scrapeHomesInIndexPage(
        "https://www.airbnb.com.br/s/Brasil/homes?refinement_paths%5B%5D=%2Fhomes&query=Brasil&adults=5&children=0&infants=0&guests=5&place_id=ChIJzyjM68dZnAARYz4p8gYVWik&toddlers=0&search_type=UNKNOWN&map_toggle=false&allow_override%5B%5D=&s_tag=Yx4sNO2Q"
    );

    for(var i = 0; i < homes.length; i++){
        await scrapeDescriptionPage(homes[i], descriptionPage);
    }
}

main();


