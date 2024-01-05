import { useState } from "react";
import Image from "next/image";
import styles from "@/components/RadioBtn.module.css";

import twoPers from "@/logo/twopers.svg";
import threePers from "@/logo/threepers.svg";

//CREW TENTS
export default function TentRadioBtnOne({ name, id, text, calcTents, tentOption, setTentOption, ticketAmount, setTwoPers, setThreePers }) {
  return (
    <>
      <div className={`cursor-pointer mb-5 outline-1 outline hover:outline-[3px] outline-[var(--accent-color)] w-full md:w-full h-80 md:h-56 ${styles.checked} ${tentOption === "crewTents" && "outline-[3px]"}`}>
        <label htmlFor={id} className="grid grid-rows-5 p-4 lg:grid-rows-2 lg:grid-cols-4 cursor-pointer  h-full w-full text-[var(--secondary-color)]">
          <div className="row-start-1 self-center w-fit h-fit flex items-center lg:col-start-1 lg:col-span-4">
            <input
              type="radio"
              className={`${styles.radio} w-5 md:w-6 h-5 md:h-6`}
              name={name}
              id={id}
              required
              onChange={() => {
                calcTents(ticketAmount, setTwoPers, setThreePers); //Funktionen findes i utils
                setTentOption((old) => "crewTents");
              }}
            />
            <p className="text-[var(--secondary-color)] text-xl md:text-4xl ml-4 h-fit">{text}</p>
          </div>
          <p className="row-start-2 self-start lg:col-start-1 lg:col-span-2">The crew will set up your tents, which are included in the price</p>
          <div className="row-start-4 flex justify-between justify-self-center w-4/5 h-fit lg:row-start-1 lg:row-span-2 lg:col-start-3 lg:col-span-2 lg:self-center">
            <span className="flex flex-col items-center">
              <Image src={twoPers} alt="Two person telt icon" />
              <p className="text-base">2-person</p>
              <p className="text-base">299 ,-</p>
            </span>
            <span className="flex flex-col items-center">
              <Image src={threePers} alt="Three person telt icon" />
              <p className="text-base">3-person</p>
              <p className="text-base">399 ,-</p>
            </span>
          </div>
        </label>
      </div>
    </>
  );
}

//Validerings fejl:
//div og p er ikke tilladt inde i et label
