"use server";

import * as cheerio from "cheerio";

import { NextResponse } from "next/server";

import { Offer } from "@/types/offerData";

export async function olxScrap(city: string, job_type: string) {
  let OLX_URL = `https://www.olx.pl/praca/${city}/?search%5Bdist%5D=15`;

  let searchParamsURL = "";
  if (job_type === "student_status") {
    searchParamsURL =
      "&search%5Bfilter_enum_special_requirements%5D%5B0%5D=student_status";
  }

  if (job_type === "remote_work_possibility") {
    searchParamsURL =
      "&search%5Bfilter_enum_workplace%5D%5B0%5D=remote_work_possibility";
  }

  const otherJobTypes = ["fulltime", "parttime", "halftime", "seasonal"];
  if (otherJobTypes.includes(job_type!)) {
    searchParamsURL = `&search%5Bfilter_enum_type%5D%5B0%5D=${job_type}`;
  }

  OLX_URL += searchParamsURL;

  try {
    const response = await fetch(OLX_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Błąd połączenia" },
        { status: response.status }
      );
    }

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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
