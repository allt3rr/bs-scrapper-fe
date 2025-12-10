"use server";

import { Offer } from "@/types/offerData";
import * as cheerio from "cheerio";

// Funkcja pomocnicza do pobierania i przetwarzania jednej strony
export async function fetchAndParsePage(
  url: string,
  pageNumber: number
): Promise<{ offers: Offer[]; count: number; maxPage: number | null }> {
  const fullUrl = `${url}&page=${pageNumber}`;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  };

  const response = await fetch(fullUrl, { headers });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch page ${pageNumber} with status ${response.status}`
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const offers: Offer[] = [];
  const card = $(".jobs-ad-card");

  let maxPage: number | null = null;
  if (pageNumber === 1) {
    const pageNumbers: number[] = [];

    $('li[data-testid="pagination-list-item"] > a').each((i, el) => {
      const text = $(el).text().trim();
      const num = parseInt(text, 10);

      if (!isNaN(num) && num > 0) {
        pageNumbers.push(num);
      }
    });

    if (pageNumbers.length > 0) {
      maxPage = Math.max(...pageNumbers);
    }
  }

  card.each((i, el) => {
    const name = $(el).find("h4").text().trim();
    const salary_tag = $(el).find("p:contains('zł')").text();
    const salary = salary_tag ? salary_tag.trim() : null;
    const link = $(el).find("a[href*='/oferta/praca/']").attr("href");
    const detailed_data = $(el).find(".css-w0dc4x");
    const city_tag = $(detailed_data[0]).find(".css-jw5wnz").text().trim();
    const city = city_tag ? city_tag : null;
    const availability_tag = $(detailed_data[1]).text().trim();
    const availability = availability_tag ? availability_tag : null;
    const contractType_tag = $(detailed_data[2]).text().trim();
    const contractType = contractType_tag ? contractType_tag : null;

    offers.push({
      id: i.toString(),
      name: name,
      salary: salary,
      link: "https://olx.pl" + link,
      city: city,
      availability: availability,
      contractType: contractType,
    });
  });

  return { offers, count: offers.length, maxPage };
}
