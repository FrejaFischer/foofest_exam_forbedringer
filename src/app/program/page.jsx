"use client";
import { useEffect, useState } from "react";
import HeaderTwo from "@/components/HeaderTwo";
import Layout from "@/components/Layout";
import Schedule from "@/components/Schedule";
import SecondaryButton from "@/components/SecondaryButton";
import Spinner from "@/components/Spinner";
//export const dynamic = "force-dynamic";

// FETCHER DATA FRA DATABASEN MED SCHEDULE FOR AT TAGE FAT I PROGRAMMET
export default function Program() {
  const [spinnerDisplay, setSpinnerDisplay] = useState(true);
  const [ourData, setOurData] = useState("");

  useEffect(() => {
    async function fetchFunction() {
      let response = await fetch(`https://plant-flaxen-glove.glitch.me/schedule`, { method: "GET" });
      const data = await response.json();
      setOurData(data);
      setSpinnerDisplay(false);
    }

    fetchFunction();
  }, []);

  return (
    <Layout current="Program">
      <Spinner spinnerDisplay={spinnerDisplay} />
      <HeaderTwo page="Program" />
      <SecondaryButton />
      {/* SENDER DATA MED NED TIL SCHEDULE - HVIS DEN HAR FETCHET OG OURDATA DERMED IKKE STADIG ER EN TOM STRING */}
      {ourData !== "" && <Schedule data={ourData}></Schedule>}
    </Layout>
  );
}
