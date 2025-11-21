"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowBigRightDashIcon } from "lucide-react";

type Offer = {
  id: string;
  name: string;
  salary: string | null;
  link: string;
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
        `https://bs-scrapper-be.onrender.com/data?provider=${provider}`,
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
      <div className="grid place-items-center w-screen">
        {isLoading && <p>Ładowanie...</p>}

        {data?.offers && data?.offers?.length > 0 && (
          <div className="w-2/3">
            <h3 className="text-xl font-bold place-self-start mb-1">
              {data?.title}
            </h3>
            <ul className="grid grid-cols-3 w-full gap-4">
              {data?.offers.map((offer) => (
                <li
                  key={offer.id}
                  className="bg-gray-100 rounded p-2 flex flex-col justify-between gap-4 shadow-md hover:shadow-lg hover:scale-105 hover:cursor-default duration-200 transition-all group"
                >
                  <div className="flex">
                    <p className="font-bold w-2/3">{offer.name}</p>
                    {offer.salary && (
                      <span className="text-sm w-1/3">{offer.salary}</span>
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
                </li>
              ))}
            </ul>
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
