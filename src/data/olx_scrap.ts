"use server";

import { NextResponse } from "next/server";

import { Offer } from "@/types/offerData";
import { fetchAndParsePage } from "./utils/olx";

const MAX_CONCURRENT_REQUESTS = 5; // maksymalna ilość żądań

export async function olxScrap(city: string, job_type: string) {
  let OLX_URL = `https://www.olx.pl/praca/${city}/?search%5Bdist%5D=15`;
  let searchParamsURL = "";

  if (job_type === "student_status") {
    searchParamsURL =
      "&search%5Bfilter_enum_special_requirements%5D%5B0%5D=student_status";
  } else if (job_type === "remote_work_possibility") {
    searchParamsURL =
      "&search%5Bfilter_enum_workplace%5D%5B0%5D=remote_work_possibility";
  } else {
    const otherJobTypes = ["fulltime", "parttime", "halftime", "seasonal"];
    if (otherJobTypes.includes(job_type!)) {
      searchParamsURL = `&search%5Bfilter_enum_type%5D%5B0%5D=${job_type}`;
    }
  }
  OLX_URL += searchParamsURL;

  try {
    const firstPageResult = await fetchAndParsePage(OLX_URL, 1);

    let allOffers: Offer[] = firstPageResult.offers;
    const maxPage = firstPageResult.maxPage;

    if (!maxPage || maxPage <= 1) {
      return {
        title: "OLX oferty pracy",
        count: allOffers.length,
        offers: allOffers,
      };
    }

    // zadania dla pozotałych stron
    const pagesToFetch = [];
    for (let i = 2; i <= maxPage; i++) {
      pagesToFetch.push(i);
    }

    // Throtling (równoległe pobieranie w paczkach)
    const allPagePromises: Promise<void>[] = [];

    // przetwarzanie paczki stron przy użyciu Promise.allSettled
    const processChunk = async (chunk: number[]) => {
      const chunkPromises = chunk.map((pageNumber) => {
        return fetchAndParsePage(OLX_URL, pageNumber);
      });

      const results = await Promise.allSettled(chunkPromises);

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          allOffers.push(...result.value.offers);
        } else {
          console.warn(`Pominięto stronę (błąd): ${result.reason}`);
        }
      });
    };

    // tworzenie i przetwarzanie paczek
    for (let i = 0; i < pagesToFetch.length; i += MAX_CONCURRENT_REQUESTS) {
      const chunk = pagesToFetch.slice(i, i + MAX_CONCURRENT_REQUESTS);
      allPagePromises.push(processChunk(chunk));
    }

    // czekamy na zakonczenie wszystkich rownoleglych paczek
    await Promise.all(allPagePromises);

    // nadanie ponownie id
    allOffers = allOffers.map((offer, index) => ({
      ...offer,
      id: index.toString(),
    }));

    return {
      title: "OLX oferty pracy",
      count: allOffers.length,
      offers: allOffers,
    };
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
