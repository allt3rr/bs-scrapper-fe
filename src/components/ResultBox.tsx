import Link from "next/link";
import { ArrowBigRightDashIcon, Clock, FileText, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DataType } from "@/types/offerData";
import LoadingThreeDotsJumping from "./animations/Loader";

const ResultBox = ({
  isLoading,
  data,
}: {
  isLoading: boolean;
  data: DataType;
}) => {
  return (
    <div className="grid place-items-center mt-5">
      {isLoading && <LoadingThreeDotsJumping />}

      {data?.offers && data?.offers?.length > 0 && (
        <div className="w-auto md:w-2/3">
          <h3 className="text-xl font-bold place-self-start mb-1">
            Znaleziono {data?.title}: {data.count}
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
  );
};

export default ResultBox;
