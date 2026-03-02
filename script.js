const input = document.getElementById("country-input");
const btn = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

// Button click triggers search
btn.addEventListener("click", () => {
  const countryName = input.value.trim();
  if (!countryName) {
    errorMessage.textContent = "Please enter a country name.";
    return;
  }
  searchCountry(countryName);
});

async function searchCountry(countryName) {
  try {
    spinner.classList.remove("hidden");
    countryInfo.innerHTML = "";
    borderingCountries.innerHTML = "";
    errorMessage.textContent = "";

    // Fetch main country info
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!response.ok) throw new Error("Country not found");
    const data = await response.json();
    const country = data[0];
    const population = country.population.toLocaleString();

    // Display main country info
    countryInfo.innerHTML = `
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
      <h2>${country.name.common}</h2>
      <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
      <p><strong>Population:</strong> ${population}</p>
      <p><strong>Region:</strong> ${country.region}</p>
    `;

    // Display neighboring countries with flags
    if (country.borders && country.borders.length > 0) {
      // Spinner while fetching neighbors
      spinner.classList.remove("hidden");

      const codes = country.borders.join(",");
      const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}`);
      const borderData = await res.json();

      // Add heading
      const heading = document.createElement("h3");
      heading.textContent = "Neighboring Countries:";
      borderingCountries.appendChild(heading);

      // Add each neighbor
      borderData.forEach(c => {
        const div = document.createElement("div");
        div.className = "border-country";
        div.innerHTML = `
          <img src="${c.flags.png}" alt="Flag of ${c.name.common}" width="50">
          <p>${c.name.common}</p>
        `;
        borderingCountries.appendChild(div);
      });
    } else {
      borderingCountries.textContent = "No bordering countries";
    }

  } catch (error) {
    errorMessage.textContent = error.message;
  } finally {
    spinner.classList.add("hidden");
  }
}