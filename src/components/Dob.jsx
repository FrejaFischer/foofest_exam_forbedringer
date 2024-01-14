"use client";
import { useRef } from "react";
export default function Dob({ day, month, year }) {
  //Her benyttes useRef, der kan bruges til at manipulere dom'en.
  //Der er her lavet to forskellige referencer, der så er sat på month's input og year's input
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  function changeFocus(e) {
    //Hvis den maksimale længde er nået, skal focus gå til næste felt. Den bliver kaldt når der sker ændringer i feltet
    if (e.target.value.length == e.target.maxLength) {
      //Her spørg vi om det er day input der har kaldt funktionen eller month
      //der er lige tilføjet et "eller", da det var nødvendigt at have anden værdi for name på EKSTRA TICKETS
      if (e.target.name === "day" || e.target.name === "day_ekstra") {
        //Her tages der fat i monthRef's current, hvilket er i lig med det dom element den er sat på. Så her er det months's inputfelt.
        //Der sættes focus på month
        monthRef.current.focus();
      } else if (e.target.name === "month" || e.target.name === "month_ekstra") {
        yearRef.current.focus();
      }
    }
  }
  return (
    <>
      <p className="text-[var(--secondary-color)] text-[16px] font-normal">DATE OF BIRTH</p>
      <div className="flex flex-row gap-4 max-w-lg justify-between">
        <div className="flex flex-col shrink mb-6 mt-1 w-1/4">
          <label className="text-[var(--secondary-color)] w-fit semibold text-[#c1bebe]" htmlFor="day">
            DAY
          </label>
          <input
            className="w-full bg-[var(--primary-color)] outline-1 text-[var(--secondary-color)] p-4 outline focus:outline-[3px] outline-[var(--accent-color)]"
            id="day"
            placeholder="DD"
            name={day}
            type="text"
            maxLength="2"
            required
            onChange={changeFocus}
          />
        </div>
        <div className="flex flex-col shrink mb-6 mt-1 w-1/4">
          <label className="text-[var(--secondary-color)] w-fit semibold text-[#c1bebe]" htmlFor="month">
            MONTH
          </label>
          <input
            className="w-full bg-[var(--primary-color)] outline-1 text-[var(--secondary-color)] p-4 outline focus:outline-[3px] outline-[var(--accent-color)]"
            id="month"
            placeholder="MM"
            name={month}
            type="text"
            maxLength="2"
            ref={monthRef}
            required
            onChange={changeFocus}
          />
        </div>
        <div className="flex flex-col shrink mb-6 mt-1 w-2/4">
          <label className="text-[var(--secondary-color)] w-fit semibold text-[#c1bebe]" htmlFor="year">
            YEAR
          </label>
          <input
            className="w-full bg-[var(--primary-color)] outline-1 text-[var(--secondary-color)] p-4 outline focus:outline-[3px] outline-[var(--accent-color)]"
            id="year"
            placeholder="YYYY"
            name={year}
            type="text"
            maxLength="4"
            ref={yearRef}
            required
          />
        </div>
      </div>
    </>
  );
}
