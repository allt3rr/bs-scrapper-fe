"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowBigRightDashIcon, Clock, FileText, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Offer = {
  id: string;
  name: string;
  salary: string | null;
  link: string;
  city: string | null;
  availability: string | null;
  contractType: string | null;
};

type DataType = {
  title: string;
  offers: Offer[];
} | null;

const Scrappers = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DataType>(null);

  const services = [{ name: "olx" }];

  const handleClick = async (provider: string) => {
    setIsLoading(true);
    setData(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FETCH_ADDRESS}/scrapper?provider=${provider}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Response error: ${res.status}`);
      }

      const jsonData = await res.json();
      setData(jsonData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Services buttons */}
      <div className="flex items-center justify-center gap-4 my-3">
        {services.map((service, index) => (
          <Button
            key={index}
            size={"lg"}
            variant={"outline"}
            className="cursor-pointer uppercase"
            onClick={() => handleClick(service.name)}
          >
            {service.name}
          </Button>
        ))}
      </div>

      {/* Offers display */}
      <div className="grid place-items-center">
        {isLoading && <p>Ładowanie...</p>}

        {data?.offers && data?.offers?.length > 0 && (
          <div className="w-auto md:w-2/3">
            <h3 className="text-xl font-bold place-self-start mb-1">
              {data?.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-4">
              {data?.offers.map((offer) => (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  key={offer.id}
                >
                  <AccordionItem value="#">
                    <AccordionTrigger className="bg-gray-100 rounded p-2 flex flex-col justify-between gap-4 shadow-md hover:shadow-lg hover:scale-105 hover:cursor-default duration-200 transition-all group">
                      <div className="flex">
                        <p
                          className={`font-bold ${
                            offer.salary ? "w-2/3" : "w-full"
                          }`}
                        >
                          {offer.name}
                        </p>
                        {offer.salary && (
                          <span className="text-sm w-1/3">{offer.salary}</span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance bg-gray-100 p-4 rounded-b">
                      <div className="text-sm font-medium gap-1 flex flex-col">
                        {offer.city && (
                          <p className="flex items-center gap-1">
                            <MapPin />
                            {offer.city}
                          </p>
                        )}
                        {offer.availability && (
                          <p className="flex items-center gap-1">
                            <Clock />
                            {offer.availability}
                          </p>
                        )}
                        {offer.contractType && (
                          <p className="flex items-center gap-1">
                            <FileText />
                            {offer.contractType}
                          </p>
                        )}
                      </div>
                      <Link
                        href={offer.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-1 self-end group-hover:text-blue-500"
                      >
                        Przejdź do oferty <ArrowBigRightDashIcon />
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
        )}

        {!isLoading && data?.offers?.length === 0 && (
          <p>Brak ofert do wyświetlenia.</p>
        )}
      </div>
    </div>
  );
};

export default Scrappers;
