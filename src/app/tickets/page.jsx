"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PrimaryButton from "@/components/PrimaryButton";
import YourPurchase from "@/components/YourPurchase";
import Plusminus from "@/components/Plusminus";
import HeaderTwo from "@/components/HeaderTwo";
import RadioBtn from "@/components/RadioBtn";
import TentRadioBtnOne from "@/components/TentRadioBtnOne";
import TentRadioBtnTwo from "@/components/TentRadioBtnTwo";
import GreenCamping from "@/components/GreenCamping";
import Labelinput from "@/components/Labelinput";
import Dob from "@/components/Dob";
import EkstraTicket from "@/components/EkstraTicket";
import Cardinfo from "@/components/Cardinfo";
import Spinner from "@/components/Spinner";
import FiveTimer from "@/components/FiveTimer";

import { fetchAvail, sendPutRequest, calcTents, postOrder, postId } from "@/utils/utils";

export default function Home() {
  const [visible, setVisible] = useState(1); //statet afgør hvilket indhold, der bliver vist i return.
  const [ticket, setTicket] = useState({ regular: 0, vip: 0 }); //statet indeholder et object, der holder styr på antal af hendholdvis regular- samt vip-tickets
  const [ticketArray, setTicketArray] = useState([]); // Der bliver tilføjer en string "ticket" til arrayet, for hver billet der er tilføjet. Bruges til at bestemme telttyper ved Crew tents, samt antallet af "extra tickets" ved personal info
  const [chosenSpot, setChosenSpot] = useState(""); //statet bliver sat til det valgte campspot
  const [fullfillReservation, setFullfillReservation] = useState(""); //statet vil indeholde vores id (fra PUT-request), som vi til sidst sender i en POST-request
  const [spotsAvail, setSpotsAvail] = useState([]); //statet vil indeholde data, der viser hvor mange pladser, der er tilgængelige på festivallen
  const [twoPers, setTwoPers] = useState(0); //statet med antal af to-personers telte
  const [threePers, setThreePers] = useState(0); //statet med antal af 3-personers telte
  const [tentOption, setTentOption] = useState(""); //statet med valgte telt option, der er valgt. Bliver brugt i styling ved TentRadioBtnOne + Two, samt i YourPurchase
  const [greenCamping, setGreenCamping] = useState(false); //statet med om GREEN CAMPING  er valgt eller ikke
  const [personalFocus, setPersonalFocus] = useState(true); //statet til at holde styr på om collapsen i personal information skal være open (true) eller close (false)

  const [spinnerDisplay, setSpinnerDisplay] = useState(true); //statet afgør hvorvidt spinneren bliver vist. Ses ved visible===1 og visible===6
  const [hidden, setHidden] = useState(true); //Statet styrer hvorvidt alert message skal være hidden eller ej

  //Denne function tager brugeren til toppen af siden. Funktionen bliver kaldt når der "skiftes side" på siden.
  function scrollToTop() {
    //Her har vi benyttet ChatGPT til at få hjælp til at finde en smart måde at scrolle på til toppen af vinduet.
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  //visible===1 (CHOOSE TICKETS)------------------------------------------------------------
  useEffect(() => {
    async function availableSpots() {
      const fetchData = await fetchAvail(); //Kalder fetch-funktionen fra utils mappen i src
      setSpotsAvail(fetchData);
      setSpinnerDisplay(false);
    }

    availableSpots();
  }, []); //Her fetches available spots, når siden bliver renderet første gang

  const ticketAmount = ticket.regular + ticket.vip; // Beregner det fulde antal af billetter
  let dataObj = {}; // Dette objekt bliver det komplette objekt med alle opsamlede værdier
  let putDataObj = {}; // Dette objekt, bliver objektet der sendes i PUT-requesten

  //visible===2 (CHOOSE CAMPINGSPOTS)------------------------------------------------------
  async function validateCampspot() {
    putDataObj.area = chosenSpot; //Tilføjer chosenSpot til putDataObj, da dette sendes i PUT-requesten
    putDataObj.amount = ticketAmount; //Tilføjer ticketAmount til putDataObj, da dette sendes i PUT-requesten
    console.log("dette er PUTobjektet", putDataObj);
    const putRequest = await sendPutRequest(putDataObj);
    const { id } = putRequest;
    setFullfillReservation(id); //Her sætter vi FullfillReservation til id'et, så vi senere kan bruge "reservation", når vi bruger postId
    scrollToTop();
    setVisible((o) => o + 1);
  } //Hvis formen i visible===2 (CHOOSE CAMPINGSPOTS) opfylder dens requirements, bliver denne funktion kaldt

  //visible===3 (CHOOSE TENT OPTION)-------------------------------------------------------
  let copyTicketArray = ticketArray; //Kopi af ticketArray, så vi kan arbejde med det senere
  function validateTent() {
    copyTicketArray.pop(); //Kopien af TicketArray bliver poppet, så det sidste item forsvinder. Dermed har vi det antal items, der passer til antal ekstra gæster
    scrollToTop();
    setVisible((o) => o + 1);
  } //Hvis formen i visible===3 (CHOOSE TENT OPTION) opfylder dens requirements, bliver denne funktion kaldt

  //visible===4 (PERSONAL INFORMATION)------------------------------------------------------
  function setFocus() {
    if (personalFocus === false) {
      setPersonalFocus(true);
    }
  } //Funktion der åbner collapse, hvis den er i focus

  function addPersonalInfo(evt) {
    //Hér tilføjer vi items (vores states) til dataObj
    dataObj.regular = ticket.regular;
    dataObj.vip = ticket.vip;
    dataObj.amount = ticketAmount;
    dataObj.campingspot = chosenSpot;
    dataObj.two_pers_tent = twoPers;
    dataObj.three_pers_tent = threePers;
    dataObj.greenCamping = greenCamping;

    const formData = new FormData(evt.target); //denne er nødvendig fordi vi bruger onSubmit og ikke action
    const firstname = formData.get("firstname");
    dataObj.firstname = firstname;
    const lastname = formData.get("lastname");
    dataObj.lastname = lastname;
    const day = formData.get("day");
    dataObj.day = day;
    const month = formData.get("month");
    dataObj.month = month;
    const year = formData.get("year");
    dataObj.year = year;
    const adress = formData.get("adress");
    dataObj.adress = adress;
    const zipcode = formData.get("zipcode");
    dataObj.zipcode = zipcode;
    const city = formData.get("city");
    dataObj.city = city;
    const email = formData.get("email");
    dataObj.email = email;
    const telephone = formData.get("telephone");
    dataObj.telephone = telephone;

    if (ticketAmount > 1) {
      submitEkstraValues(evt);
    } //Kalder submitEkstraValues, hvis der er valgt mere end 1 billet.

    postOrder(dataObj); //Hér bliver vores post-funktion kaldt, som poster vores objekt: dataObj. Findes i utils
    scrollToTop();
    setVisible((o) => o + 1);
  }

  // submitEkstraValues(e) er lavet med hjælp fra Jonas d. 12/12-2023
  //Forsøger at opsamle input fra EKSTRA-TICKETS, putter hver ekstra person i et objekt hver, derefter pusher jeg objekterne ind i et array ekstraPersons.
  function submitEkstraValues(e) {
    e.preventDefault();
    let ekstraPersons = [];

    let firstName_ekstra = e.target.elements.firstname_ekstra;
    let lastName_ekstra = e.target.elements.lastname_ekstra;
    let day_ekstra = e.target.elements.day_ekstra;
    let month_ekstra = e.target.elements.month_ekstra;
    let year_ekstra = e.target.elements.year_ekstra;

    if (!firstName_ekstra.length) {
      firstName_ekstra = [e.target.elements.firstname_ekstra];
      lastName_ekstra = [e.target.elements.lastname_ekstra];
      day_ekstra = [e.target.elements.day_ekstra];
      month_ekstra = [e.target.elements.month_ekstra];
      year_ekstra = [e.target.elements.year_ekstra];
    }
    firstName_ekstra.forEach((field, index) => {
      let onePerson = { firstname_ekstra: "", lastname_ekstra: "", day_ekstra: 0, month_ekstra: 0, year_ekstra: 0 };
      onePerson.firstname_ekstra = field.value;
      onePerson.lastname_ekstra = lastName_ekstra[index].value;
      onePerson.day_ekstra = day_ekstra[index].value;
      onePerson.month_ekstra = month_ekstra[index].value;
      onePerson.year_ekstra = year_ekstra[index].value;

      ekstraPersons.push(onePerson);
      dataObj.ekstraPersons = ekstraPersons;
    });
  }

  //visible===5 (CHOOSE PAYMENT) -------------------------------------------------------
  function validatePayment() {
    scrollToTop();
    setSpinnerDisplay(true);
    setVisible((o) => o + 1);
    postId(fullfillReservation); // Send POST-request med id. Findes i utils.
  }

  //visible===6 (ORDER CONFIRMATION) -------------------------------------------------------
  if (visible === 6) {
    setTimeout(() => {
      setSpinnerDisplay(false);
    }, 3000); //Viser spinner i 3 sekunder før den siger order confirmed
  }

  return (
    <Layout current="Tickets">
      {(visible === 3 || visible === 4 || visible === 5) && (
        <>
          <HeaderTwo page="Checkout"></HeaderTwo>
          <FiveTimer />
        </>
      )}
      {visible === 1 && (
        // I denne section har vi ikke noget form-tag, da vi ikke bruger inputfelter på den første "side". Derimod samler vi data i et object, når der klikkes next
        <section className="md:relative">
          <Spinner spinnerDisplay={spinnerDisplay} />
          <HeaderTwo page="Checkout"></HeaderTwo>
          <h3>CHOOSE TICKETS</h3>
          <div className="w-full h-fit md:grid md:grid-cols-2 md:gap-8">
            <div className="outline outline-[var(--accent-color)] outline-1 p-5 md:p-6 md:py-12 mb-12 w-full h-fit">
              <div className="grid grid-cols-4 place-items-center mb-8 md:mb-10">
                <p className="justify-self-start col-start-1 col-span-2">REGULAR TICKET</p>
                <Plusminus
                  //sender en prop ned til Plusminus. Funktionen vil add' et tal til 'regular ticket'
                  updateTicketAdd={function updateTickets() {
                    {
                      setTicket((old) => ({ ...old, regular: old.regular + 1 }));
                      // KOMMENTAR ved klik tilføjes "ticket" til ticketArray.
                      setTicketArray((oldArray) => [...oldArray, "ticket"]);
                      setHidden(true); //Fjerner alert message
                    }
                  }}
                  //sender en prop ned til Plusminus. Funktionen vil trække et tal fra 'regular ticket'
                  updateTicketSubstract={function updateTickets() {
                    {
                      setTicket((old) => ({ ...old, regular: old.regular - 1 }));
                      // KOMMENTAR slice(0, -1) sørger for at fjerne det sidste item i arrayet
                      setTicketArray((oldArray) => oldArray.slice(0, -1));
                      setHidden(true);
                    }
                  }}
                  setTicket={setTicket}
                />
                <p className="justify-self-end">799,-</p>
              </div>
              <div className="grid grid-cols-4 place-items-center">
                <p className="justify-self-start col-start-1 col-span-2">VIP TICKET</p>
                <Plusminus
                  //sender en prop med til Plusminus. Funktionen vil add' et tal til 'regular ticket' eller trække et tal fra
                  updateTicketAdd={function updateTickets() {
                    {
                      setTicket((old) => ({ ...old, vip: old.vip + 1 }));
                      // KOMMENTAR ved klik tilføjes "ticket" til ticketArray
                      setTicketArray((oldArray) => [...oldArray, "ticket"]);
                      setHidden(true);
                    }
                  }}
                  updateTicketSubstract={function updateTickets() {
                    {
                      setTicket((old) => ({ ...old, vip: old.vip - 1 }));
                      // KOMMENTAR slice(0, -1) sørger for at fjerne det sidste item i arrayet
                      setTicketArray((oldArray) => oldArray.slice(0, -1));
                      setHidden(true);
                    }
                  }}
                  setTicket={setTicket}
                />
                <p className="justify-self-end">1299,-</p>
              </div>
              <div role="alert" className={`alert rounded-none bg-[var(--primary-color)] border-none w-fit p-0 pt-4 ${hidden ? "hidden" : "flex"}`}>
                {/* Denne alert er fra DaisyUI */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-[var(--accent-color)] shrink-0 w-6 h-6">
                  <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {ticketAmount === 0 && <p className="text-[var(--secondary-color)]">Please choose the ticket amount</p>}
                {ticketAmount > 10 && <p className="text-[var(--secondary-color)]">You can buy a maximum of 10 tickets</p>}
              </div>
            </div>
            <div className="w-full md:w-full justify-self-end md:sticky md:top-6 md:h-fit">
              {/* Her sendes ticket (som er et objekt) ned til YourPurchase, så jeg senerehen kan få fat i regular samt vip-værdierne */}
              <YourPurchase ticket={ticket} twoPers={twoPers} threePers={threePers} />
              <PrimaryButton
                text="NEXT"
                onClick={() => {
                  if (ticketAmount > 0 && ticketAmount < 11) {
                    setVisible((o) => o + 1);
                    scrollToTop();
                  } else {
                    setHidden(false);
                    scrollToTop();
                  }
                }}
              />
            </div>
          </div>
        </section>
      )}
      {visible === 2 && (
        <section>
          <HeaderTwo page="Checkout"></HeaderTwo>
          <h3>CHOOSE CAMPINGSPOT</h3>
          <form action={validateCampspot} className="w-full h-fit md:grid md:grid-cols-2 md:gap-8">
            <div className="sm:grid sm:grid-cols-2 sm:gap-8 md:grid-cols-1 xl:grid-cols-2">
              <RadioBtn spotsAvail={spotsAvail} chosenSpot={chosenSpot} setChosenSpot={setChosenSpot} name="campspots" id="Svartheim" text="SVARTHEIM" ticketAmount={ticketAmount}></RadioBtn>
              <RadioBtn spotsAvail={spotsAvail} chosenSpot={chosenSpot} setChosenSpot={setChosenSpot} name="campspots" id="Nilfheim" text="NILFHEIM" ticketAmount={ticketAmount}></RadioBtn>
              <RadioBtn spotsAvail={spotsAvail} chosenSpot={chosenSpot} setChosenSpot={setChosenSpot} name="campspots" id="Helheim" text="HELHEIM" ticketAmount={ticketAmount}></RadioBtn>
              <RadioBtn spotsAvail={spotsAvail} chosenSpot={chosenSpot} setChosenSpot={setChosenSpot} name="campspots" id="Muspelheim" text="MUSPELHEIM" ticketAmount={ticketAmount}></RadioBtn>
              <RadioBtn spotsAvail={spotsAvail} chosenSpot={chosenSpot} setChosenSpot={setChosenSpot} name="campspots" id="Alfheim" text="ALFHEIM" ticketAmount={ticketAmount}></RadioBtn>
            </div>
            <div className="w-full md:w-full justify-self-end md:sticky md:top-6 md:h-fit">
              <YourPurchase ticket={ticket} campingspot={chosenSpot.toUpperCase()} twoPers={twoPers} threePers={threePers} />
              <PrimaryButton text="NEXT" />
            </div>
          </form>
        </section>
      )}
      {visible === 3 && (
        <section className="md:relative grid">
          <h3>CHOOSE A TENT OPTION</h3>
          <form action={validateTent} className="w-full h-fit md:grid md:grid-cols-2 md:gap-8">
            <div>
              <TentRadioBtnOne
                name="tentoption"
                id="CrewTents"
                text="CREW TENTS"
                calcTents={calcTents}
                tentOption={tentOption}
                setTentOption={setTentOption}
                ticketAmount={ticketAmount}
                setTwoPers={setTwoPers}
                setThreePers={setThreePers}
              ></TentRadioBtnOne>
              <TentRadioBtnTwo name="tentoption" id="BringYourOwn" text="BRING YOUR OWN" setTwoPers={setTwoPers} setThreePers={setThreePers} tentOption={tentOption} setTentOption={setTentOption}></TentRadioBtnTwo>
              <p className="max-w-lg">Do your group want to get a quiet spot closer to the green forrest? Add the Green Camping option</p>
              <GreenCamping greenCamping={greenCamping} setGreenCamping={setGreenCamping} />
            </div>
            <div className="w-full md:w-full justify-self-end md:sticky md:top-6 md:h-fit">
              <YourPurchase ticket={ticket} campingspot={chosenSpot.toUpperCase()} twoPers={twoPers} threePers={threePers} greenCamping={greenCamping} tentOption={tentOption} />
              <PrimaryButton text="NEXT" />
            </div>
          </form>
        </section>
      )}
      {visible === 4 && (
        <section className="grid">
          <h3>PERSONAL INFORMATION</h3>

          <form onSubmit={addPersonalInfo} className="w-full h-fit md:grid md:grid-cols-2 md:gap-8">
            <div>
              <div
                tabIndex={0}
                onFocus={() => {
                  setFocus();
                }}
                className={` focus:border-l-rose-700 collapse ${personalFocus ? "collapse-open" : "collapse-close"} bg-[var(--primary-color)] collapse-arrow border border-[var(--accent-color)] rounded-none mb-4`}
              >
                <input
                  tabIndex={-1}
                  type="checkbox"
                  id="appearance"
                  onClick={() => {
                    setPersonalFocus((old) => !old);
                  }}
                />
                <div tabIndex={-1} className="collapse-title text-[var(--secondary-color)] text-xl md:text-4xl">
                  YOUR INFORMATION
                </div>
                <div className="collapse-content">
                  <Labelinput id="firstname" inputname="firstname" type="text" label="FIRSTNAME" placeholder="EX. PETER"></Labelinput>
                  <Labelinput id="lastname" inputname="lastname" type="text" label="LASTNAME" placeholder="EX. THOMSON"></Labelinput>
                  <Dob day="day" month="month" year="year"></Dob>
                  <Labelinput id="adress" inputname="adress" type="text" label="ADRESS" placeholder="EX. STENSTYKKEVEJ, 62"></Labelinput>
                  <Labelinput id="zipcode" inputname="zipcode" type="text" label="ZIPCODE" placeholder="EX. 2650"></Labelinput>
                  <Labelinput id="city" inputname="city" type="text" label="CITY" placeholder="EX. HVIDOVRE"></Labelinput>
                  <Labelinput id="email" inputname="email" type="email" label="EMAIL" placeholder="EX. THOMSON@HOTMAIL.COM"></Labelinput>
                  <Labelinput id="telephone" inputname="telephone" type="text" label="TELEPHONE NR." placeholder="EX. 12233445"></Labelinput>
                </div>
              </div>
              {/*Hér mapper vi igennem copyTicketArray og sørger for at returnere en EkstraTicket-komponent for hver item der er i vores copyTicketArray*/}
              {copyTicketArray.map((item) => {
                const uniqueId = Math.random();
                return <EkstraTicket id={uniqueId} key={uniqueId}></EkstraTicket>;
              })}
            </div>
            <div className="w-full md:w-full justify-self-end md:sticky md:top-6 md:h-fit">
              <YourPurchase ticket={ticket} campingspot={chosenSpot.toUpperCase()} twoPers={twoPers} threePers={threePers} greenCamping={greenCamping} tentOptionn={tentOption} />
              <PrimaryButton text="NEXT" />
            </div>
          </form>
        </section>
      )}
      {visible === 5 && (
        <section className="grid">
          <h3>CHOOSE PAYMENT</h3>
          <form action={validatePayment} className="w-full h-fit md:grid md:grid-cols-2 md:gap-8">
            <Cardinfo></Cardinfo>
            <div className="w-full md:w-full justify-self-end md:sticky md:top-6 md:h-fit">
              <YourPurchase ticket={ticket} campingspot={chosenSpot.toUpperCase()} twoPers={twoPers} threePers={threePers} greenCamping={greenCamping} tentOption={tentOption} />
              <PrimaryButton text="CHECK OUT" />
            </div>
          </form>
        </section>
      )}
      {visible === 6 && (
        <>
          <Spinner spinnerDisplay={spinnerDisplay} />
          <section className={`${spinnerDisplay && "hidden"} grid grid-cols-1 mt-28 mb-60`}>
            <h2 className="text-xxl md:text-5xl place-self-center justify-center text-center">THANK YOU!</h2>
            <h2 className="text-xxl md:text-5xl place-self-center justify-center text-center">YOUR ORDER HAS BEEN RECEIVED</h2>
            <p className="text-md md:text-lg place-self-center justify-center text-center mt-6">
              YOU`LL RECEIVE AN EMAIL <br /> WITH THE ORDER INFORMATION
            </p>
          </section>
        </>
      )}
    </Layout>
  );
}
