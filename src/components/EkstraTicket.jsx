import { useState } from "react";
import Dob from "./Dob";
import Labelinput from "./Labelinput";

//Her benyttes der af DaisyUI's collapse component (https://daisyui.com/components/collapse/)
//Tilføjet d. 5/12/23

export default function EkstraTicket({ id, isOpen }) {
  //Da DaisyUI´s collapse ikke automatisk gør det muligt at tab sig ind i dens indhold, skal vi tvinge det frem
  const [ekstraFocus, setEkstraFocus] = useState(isOpen); //Dette state er til at holde styr på om collapsen skal være open (true) eller close (false)
  console.log("my id is", id);
  function setFocus() {
    if (ekstraFocus === false) {
      setEkstraFocus(true);
    }
  }
  //className "collapse-open" og "collapse-close" er noget DaisyUI provider.
  //Der er sat 3 tabindex's. TabIndex=0 betyder: gør det muligt at tab dig til dette element (denne er sat af DaisyUI). TabIndex=-1 betyder: du kan ikke tab til dette element.
  return (
    <div tabIndex={0} onFocus={setFocus} className={`collapse ${ekstraFocus ? "collapse-open" : "collapse-close"} bg-[var(--primary-color)] collapse-arrow border border-[var(--accent-color)] rounded-none mb-4`}>
      <input
        tabIndex={-1}
        type="checkbox"
        id="appearance"
        onClick={() => {
          setEkstraFocus((old) => !old);
        }}
      />
      <div tabIndex={-1} className="collapse-title text-[var(--secondary-color)] text-xl md:text-4xl">
        EXTRA TICKET
      </div>
      <div className="collapse-content">
        <Labelinput inputname="firstname_ekstra" forId={id} id={id} label="FIRSTNAME" type="text" placeholder="EX. PETER" />
        <Labelinput inputname="lastname_ekstra" forId={id + 1} id={id + 1} label="LASTNAME" type="text" placeholder="EX. THOMSEN" />
        <Dob day="day_ekstra" month="month_ekstra" year="year_ekstra" />
      </div>
    </div>
  );
}
