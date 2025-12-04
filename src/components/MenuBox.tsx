"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  backendAddress,
  cititesOLX,
  services,
  typesOLX,
} from "@/lib/constants";
import ResultBox from "./ResultBox";
import { DataType } from "@/types/offerData";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { motion } from "motion/react";

const Scrappers = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [backend, setBackend] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const [data, setData] = useState<DataType>(null);

  const fetchData = async () => {
    if (!backend || !provider || !type || !city) return;

    setIsLoading(true);
    setData(null);

    try {
      const params = new URLSearchParams();
      params.append("provider", provider);
      params.append("type", type);
      params.append("city", city);

      const url = `${backend}/scrapper?${params.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
    <div className="mx-4">
      <div>
        {/* Buttons wrapper */}
        <div className="flex flex-wrap items-stretch justify-center gap-4 sm:gap-10">
          <div>
            {/* Backend buttons */}
            <p className="sm:text-lg">Wybierz poniższy backend:</p>
            <div className="flex items-center justify-center gap-4 mt-1 sm:my-3">
              {backendAddress.map((data, index) => (
                <Button
                  key={index}
                  size={"lg"}
                  variant={backend === data.address ? "default" : "outline"}
                  className={`cursor-pointer`}
                  onClick={() => {
                    setBackend(data.address);
                  }}
                >
                  {data.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="sm:text-lg">Wybierz serwis:</p>
            <div className="flex items-center justify-center gap-4 mt-1 sm:my-3">
              {services.map((service, index) => (
                <Button
                  key={index}
                  size={"lg"}
                  variant={service.name === provider ? "default" : "outline"}
                  className="cursor-pointer uppercase"
                  disabled={!backend}
                  onClick={() => setProvider(service.name)}
                >
                  {service.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="sm:text-lg">Co chcesz wyszukać?</p>
            <Select
              disabled={!provider}
              onValueChange={(value) => {
                setType(value);
              }}
            >
              <SelectTrigger className="w-[200px] mt-1 sm:my-3">
                <SelectValue placeholder="Wybierz typ pracy" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Typ pracy</SelectLabel>
                  {typesOLX.map((type, index) => (
                    <SelectItem key={index} value={type.url}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="sm:text-lg">Wybierz miasto:</p>
            <Select
              disabled={!type}
              onValueChange={(value) => {
                setCity(value);
              }}
            >
              <SelectTrigger className="w-[200px] mt-1 sm:my-3">
                <SelectValue placeholder="Wybierz miasto z listy" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Miasta</SelectLabel>
                  {cititesOLX.map((city, index) => (
                    <SelectItem key={index} value={city.name}>
                      {city.name[0].toUpperCase() + city.name.substring(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {city && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button className="cursor-pointer mt-6" onClick={() => fetchData()}>
              Wyszukaj
            </Button>
          </motion.div>
        )}
      </div>

      <ResultBox isLoading={isLoading} data={data} />
    </div>
  );
};

export default Scrappers;
