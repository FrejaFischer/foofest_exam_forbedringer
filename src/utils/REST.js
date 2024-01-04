export async function fetchAvail() {
  let response = await fetch(`https://plant-flaxen-glove.glitch.me/available-spots`, { method: "GET" });
  const data = await response.json();
  return data;
}

export async function sendPutRequest(putDataObj) {
  let headersList = {
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify(putDataObj);

  let response = await fetch("https://plant-flaxen-glove.glitch.me/reserve-spot", {
    method: "PUT",
    body: bodyContent,
    headers: headersList,
  });
  // Har ændret koden fra at være ".text()" til ".json()", så objektet der udskrives er json
  let data = await response.json();
  //data indeholder vores Id, som skal postes
  console.log("dette er response fra PUT", data);
  return data;
}

//beregnTelte sørger for at tildele korrekt antal telte til køberen, som herefter kan vises i YOUR PURCHASE
export function beregnTelte(ticketAmount, setTwoPers, setThreePers) {
  if (ticketAmount === 1 || ticketAmount === 2) {
    setTwoPers(1);
  } else if (ticketAmount === 3) {
    setThreePers(1);
  } else if (ticketAmount === 4) {
    setTwoPers(2);
  } else if (ticketAmount === 5) {
    setTwoPers(1);
    setThreePers(1);
  } else if (ticketAmount === 6) {
    setThreePers(2);
  } else if (ticketAmount === 7) {
    setTwoPers(2);
    setThreePers(1);
  } else if (ticketAmount === 8) {
    setTwoPers(1);
    setThreePers(2);
  } else if (ticketAmount === 9) {
    setThreePers(3);
  } else if (ticketAmount === 10) {
    setTwoPers(2);
    setThreePers(2);
  }
}
