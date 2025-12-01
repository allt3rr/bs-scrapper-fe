import { olxScrap } from "@/lib/olx_scrap";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const provider = searchParams.get("provider");

  const OLX_URL =
    "https://www.olx.pl/praca/zawiercie/?search%5Bdist%5D=30&search%5Bfilter_enum_type%5D%5B0%5D=halftime&search%5Bfilter_enum_type%5D%5B1%5D=seasonal&search%5Bfilter_enum_type%5D%5B2%5D=parttime&search%5Bfilter_enum_special_requirements%5D%5B0%5D=student_status&search%5Bfilter_enum_agreement%5D%5B0%5D=zlecenie&search%5Bfilter_enum_agreement%5D%5B1%5D=practice";

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

    console.log();
    switch (provider) {
      case "olx":
        return NextResponse.json(await olxScrap(response));
      default:
        return NextResponse.json({
          error: "Nieobsługiwany provider",
          status: 400,
        });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
