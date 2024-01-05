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

//calcTents sørger for at tildele korrekt antal telte til køberen, som herefter kan vises i YOUR PURCHASE
export function calcTents(ticketAmount, setTwoPers, setThreePers) {
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

export async function postOrder(data) {
  let headersList = {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZGZ3YXVmeXR3ZHVyb3BuZHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY4NDY3NzMsImV4cCI6MjAxMjQyMjc3M30.cX_qLqrbHMXj2dbzqfm88QbNPlMAXYOy8OQkNapHWG8",
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
  let bodyContent = JSON.stringify(data);

  let response = await fetch("https://pfdfwaufytwduropndyt.supabase.co/rest/v1/personal_informations", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  console.log("postet");
  let answer = await response.json();
  return answer;
}

// Denne funktion bliver kaldt, når den sidste knap "checkout" er klikket og formen er valideret.Funktionen sender et POST-request, som poster Id'et i backend-databsen, hvis man har nået at reservere inden for 5 minutter
export async function postId(fullfillReservation) {
  let headersList = {
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify({
    id: fullfillReservation,
  });

  let response = await fetch("https://plant-flaxen-glove.glitch.me/fullfill-reservation", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let dataResponse = await response.json();
  console.log("this is dataResponse", dataResponse);
}
