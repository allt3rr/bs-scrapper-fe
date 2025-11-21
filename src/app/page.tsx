import Scrappers from "@/components/Scrappers";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center flex-col text-center gap-6 my-20 overflow-y-auto mx-3">
      <Image src={"/logo.webp"} width={300} height={300} alt="Logo offersy" />
      <div>
        <p className="text-2xl">
          <b>Witaj!</b> w aplikacji do <u>scrapowania ofert pracy</u>!
        </p>
        <p className="text-base">Aplikacja powstała w celach edukacyjnych.</p>
      </div>
      <div className="my-10">
        <p className="text-lg">Wybierz poniższy serwis do przejrzenia ofert:</p>
        <Scrappers />
      </div>
    </div>
  );
}
