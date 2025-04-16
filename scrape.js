import getCountryCodes from "./api/getCountryCodes.js";
import getVisaRequirements from "./api/getVisaRequirements.js";
import { readJSON, writeJSON } from "./lib/file.js";

const run = async () => {
  try {
    // const countryCodes = await getCountryCodes();
    // writeJSON("./db/countryCodes.json", countryCodes);
    const countryCodes = readJSON("./db/countryCodes.json");
    const allVisaRequirements = {};
    for (let i = 0; i < countryCodes.length; i++) {
      const countryCode = countryCodes[i];
      const visaRequirements = await getVisaRequirements(countryCode);
      allVisaRequirements[countryCode] = visaRequirements;
      console.log(`fatti ${countryCode}`);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  } catch (error) {
    console.error(`Error scraping:`, error);
    return;
  }
};

run();
