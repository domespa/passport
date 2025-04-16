import { JSDOM } from "jsdom"; // JSDOM PERMETTE DI SIMULARE UNA PAGINA WEB FUORI DA BROWSER QUINDI QUI DENTRO NODE

export default async function getCountryCodes() {
  const response = await fetch(
    `https://www.passportindex.org/passport/united-arab-emirates/`
  );
  const text = await response.text();
  const dom = new JSDOM(text);
  const document = dom.window.document; // GRAZIE A JSDOM POSSIAMO POSSIAMO METTERE DENTRO LA VARIABILE "DOCUMENT" TUTTO IL CODICE HTML IN MODO DA MANIPOLARE O LEGGERE IL DOM
  const trs = document.querySelector("#psprt-dashboard-table > tbody").children;
  const countryCodes = ["united-arab-emirates"];
  Array.from(trs).forEach((tr) => {
    const a = tr.children[0].querySelector("a");
    const href = a.href;
    const [, rawCountryCode] = href.split(
      "https://www.passportindex.org/country/"
    ); // la , serve ad ignorare il primo elemento
    const countryCode = rawCountryCode.replaceAll("/", "").trim();
    countryCodes.push(countryCode);
  });
  return countryCodes;
}
