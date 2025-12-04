"use client";

import Scrappers from "@/components/MenuBox";
import Image from "next/image";
import { motion } from "motion/react";

export default function Home() {
  const duration = 1;

  return (
    <div className="flex items-center flex-col text-center gap-6 my-20">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Image src={"/logo.webp"} width={300} height={300} alt="Logo offersy" />
      </motion.div>
      <div>
        <div className="text-2xl flex gap-x-1 flex-wrap items-center justify-center">
          <motion.b
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: duration * 0.2, delay: 1.2 }}
          >
            Witaj!
          </motion.b>
          <motion.p
            initial={{ opacity: 0, translateX: 40 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration, delay: 1 + duration }}
          >
            w aplikacji do
          </motion.p>
          <motion.u
            initial={{ opacity: 0, translateX: 40 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration, delay: 1 + duration * 2 }}
          >
            scrapowania ofert pracy!
          </motion.u>
        </div>
        <motion.p
          className="text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          Aplikacja powstała w celach edukacyjnych.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 5.5 }}
      >
        <Scrappers />
      </motion.div>
    </div>
  );
}
