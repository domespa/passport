import { JSDOM } from "jsdom"; // JSDOM PERMETTE DI SIMULARE UNA PAGINA WEB FUORI DA BROWSER QUINDI QUI DENTRO NODE

export default async function getVisaRequirements(countryCode) {
  const response = await fetch(
    `https://www.passportindex.org/passport/${countryCode}/`
  );
  const text = await response.text();
  const dom = new JSDOM(text);
  const document = dom.window.document; // GRAZIE A JSDOM POSSIAMO POSSIAMO METTERE DENTRO LA VARIABILE "DOCUMENT" TUTTO IL CODICE HTML IN MODO DA MANIPOLARE O LEGGERE IL DOM
  const trs = document.querySelector("#psprt-dashboard-table > tbody").children;
  const countries = [];
  Array.from(trs).forEach((tr) => {
    // FACENDO UN FOREACH SU TRS MI DAVA ERRORE COL .CHILDREN, FIXATO FACENDO ARRAY.FROM
    const isVr = tr.classList.contains("vr");
    const isEv = tr.classList.contains("evisa");
    const countryName = tr.children[0].textContent.trim();
    const country = {
      countryName,
      isVr,
      isEv,
    };
    const rawVisaRequirement = tr.children[1].textContent
      .replace("Apply now", "")
      .trim();

    if (!rawVisaRequirement.includes("days")) {
      country.visaRequirement = rawVisaRequirement;
      countries.push(country);
      return;
    }
    const visaRequirementResults = rawVisaRequirement.split("/");
    const visaDays = visaRequirementResults[visaRequirementResults.length - 1]
      .toLowerCase()
      .replace("days", "")
      .trim();
    visaRequirementResults.pop();
    const visaRequirement = visaRequirementResults.join("/").trim();
    country.visaRequirement = visaRequirement;
    country.visaDays = Number(visaDays);
    countries.push(country);
  });
  return countries;
}
