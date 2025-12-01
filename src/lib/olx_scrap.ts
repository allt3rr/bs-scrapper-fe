"use server";

import * as cheerio from "cheerio";

interface Offer {
  id: string;
  name: string;
  salary: string | null;
  link: string;
  city: string | null;
  availability: string | null;
  contractType: string | null;
}

export async function olxScrap(response: Response): Promise<{
  title: string;
  count: number;
  offers: Offer[];
}> {
  const html = await response.text();
  const $ = cheerio.load(html);

  const offers: Offer[] = [];
  const card = $(".jobs-ad-card");

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

  const data = {
    title: "OLX oferty pracy",
    count: offers.length,
    offers,
  };

  return data;
}
