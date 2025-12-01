import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

interface Offer {
  id: string;
  name: string;
  salary: string | null;
  link: string;
  city: string | null;
  availability: string | null;
  contractType: string | null;
}

export async function GET() {
  const URL =
    "https://www.olx.pl/praca/zawiercie/?search%5Bdist%5D=30&search%5Bfilter_enum_type%5D%5B0%5D=halftime&search%5Bfilter_enum_type%5D%5B1%5D=seasonal&search%5Bfilter_enum_type%5D%5B2%5D=parttime&search%5Bfilter_enum_special_requirements%5D%5B0%5D=student_status&search%5Bfilter_enum_agreement%5D%5B0%5D=zlecenie&search%5Bfilter_enum_agreement%5D%5B1%5D=practice";

  try {
    const response = await fetch(URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Błąd połączenia z OLX" },
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

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
