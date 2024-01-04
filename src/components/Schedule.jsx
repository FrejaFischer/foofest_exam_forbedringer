// CSR
"use client";
import ProgramContent from "./ProgramContent";
import { Tabs, ConfigProvider } from "antd";
import { useState } from "react";

// SENDER DATA MED NED FRA PROGRAM PAGE
export default function Schedule({ data }) {
  // USESTATE DER VISER DE FORSKELLIGE DAGE, MONDAY ER SAT TIL DEFAULT
  const [visible, setVisible] = useState("mon");
  //console.log(data);
  //  ARRAY MED DE FORSKELLIGE TABS/ITEMS
  const items = [
    {
      key: "1",
      label: "MONDAY",
      //   CHILDREN HVOR PROGRAMCONTENT LIGGER I,
      //   HVOR VI SÆTTER VISIBLE TIL DEN GÆLDENDE DAG
      //   OG SENDER DATA MED NED
      children: <ProgramContent data={data} visible="mon" />,
    },
    {
      key: "2",
      label: "TUESDAY",
      children: <ProgramContent data={data} visible="tue" />,
    },
    {
      key: "3",
      label: "WEDNESDAY",
      children: <ProgramContent data={data} visible="wed" />,
    },
    {
      key: "4",
      label: "THURSDAY",
      children: <ProgramContent data={data} visible="thu" />,
    },
    {
      key: "5",
      label: "FRIDAY",
      children: <ProgramContent data={data} visible="fri" />,
    },
    {
      key: "6",
      label: "SATURDAY",
      children: <ProgramContent data={data} visible="sat" />,
    },
    {
      key: "7",
      label: "SUNDAY",
      children: <ProgramContent data={data} visible="sun" />,
    },
  ];
  return (
    <div className="grid grid-cols-1">
      {/* BLIVER VIST NÅR SKÆRMEN ER MOBILE/UNDER MD: */}
      <div className="place-self-center mb-10 mt-10 md:hidden">
        <label htmlFor="scheduleDays"></label>
        {/* 
        SÆTTER VALUE TIL STATEN + ONCHANGE SOM TAGER FAT I AT NÅR STATEN 
        ÆNDRER SIG SKAL VALUE SKIFTES TIL DET VALUE ER 
        */}
        <select value={visible} onChange={(e) => setVisible(e.target.value)} className="outline-none text-[var(--accent-color)] p-3 px-6 bg-[var(--primary-color)] outline outline-[var(--accent-color)]" name="scheduleDays" id="scheduleDays">
          <option value="mon">MONDAY</option>
          <option value="tue">TUESDAY</option>
          <option value="wed">WEDNESDAY</option>
          <option value="thu">THURSDAY</option>
          <option value="fri">FRIDAY</option>
          <option value="sat">SATURDAY</option>
          <option value="sun">SUNDAY</option>
        </select>
      </div>
      {/* BLIVER VIST NÅR SKÆRMEN ER OVER MD: */}
      <div className="hidden md:block">
        {/* KOMMER FRA ANTDESIGN SÅ MAN KAN STYLE TABS */}
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                /* HER ER DE FORSKELLIGE COMPONENT ÆNDRINGER
                ÆNDRER PÅ NÅR TABBEN ER ACTIVE, SELECTED, 
                BAR FARVEN OG TEKST FARVEN
                */
                itemActiveColor: "var(--accent-color)",
                itemSelectedColor: "var(--accent-color)",
                inkBarColor: "var(--accent-color)",
                itemColor: "var(--secondary-color)",
                itemHoverColor: "var(--accent-color)",
              },
            },
          }}
        >
          {/* 
            HER ER TABS SAT DEFAULT TIL KEY 1/MONDAY, 
            CENTERED FOR AT CENTRERE TABS I MIDTEN,
            ITEMS HENTER ITEMS FRA ARRAYET MED DE FORSKELLIGE DAGE + INDHOLD 
            */}
          <Tabs defaultActiveKey="1" centered items={items} />
        </ConfigProvider>
      </div>
      {/* BLIVER KUN VIST I MOBILE/UNDER MD: */}
      <div className="md:hidden">
        {/* SENDER DATA OG VISIBLE MED NED TIL PROGRAMCONTENT */}
        <ProgramContent data={data} visible={visible}></ProgramContent>
      </div>
    </div>
  );
}
