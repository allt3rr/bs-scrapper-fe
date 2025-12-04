import { olxScrap } from "@/data/olx_scrap";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const provider = searchParams.get("provider");

  switch (provider) {
    case "olx":
      const city = searchParams.get("city")!;
      const job_type = searchParams.get("type")!;

      return NextResponse.json(await olxScrap(city, job_type));
    default:
      return NextResponse.json({
        error: "Nieobsługiwany provider",
        status: 400,
      });
  }
}
