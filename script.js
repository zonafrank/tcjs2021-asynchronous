"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

///////////////////////////////////////
function renderError(errorMessage) {
  countriesContainer.insertAdjacentHTML("beforeend", errorMessage);
}

function renderCountry(country, className = "") {
  console.log(country);
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${country.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${country.name.common}</h3>
        <h4 class="country__region">${country.region}</h4>
        <p class="country__row"><span>👫</span>${(
          country.population / 1000000
        ).toFixed(1)}M people</p>
        <p class="country__row"><span>🗣️</span>${
          Object.values(country.languages)[0]
        }</p>
        <p class="country__row"><span>💰</span>${
          Object.keys(country.currencies)[0]
        }</p>
      </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
}

function getJSON(url, msg) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Country not found - ${response.status}`);
    }
    return response.json();
  });
}

function getCountryAndNeighbour(countryName) {
  // Ajax call for country 1
  getJSON("https://restcountries.com/v3.1/name/" + countryName)
    .then((data) => {
      console.log(data);
      if (!data) return;
      const country = data.find((item) => {
        return item.name.common.toLowerCase() === countryName;
      });

      if (!country) {
        throw new Error(`Country not found!`);
      }
      // Render country 1
      renderCountry(country);
      const neighbour = country.borders[0];
      if (!neighbour) return;
      return neighbour;
    })
    .then((nbrCode) => {
      return getJSON(`https://restcountries.com/v3.1/alpha/${nbrCode}`);
    })
    .then((country) => renderCountry(country[0], "neighbour"))
    .catch((err) => {
      console.error(err);
      renderError(`Something went wrong! ${err.message}. Try again.`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
}

btn.addEventListener("click", () => getCountryAndNeighbour("canada"));

// Image loading

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};
const imgContainer = document.querySelector(".images");

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement("img");
    img.src = imgPath;
    img.addEventListener("load", function () {
      imgContainer.append(img);
      resolve(img);
    });
    img.addEventListener("error", function () {
      reject(new Error("Image not found"));
    });
  });
};

let currentImg;
createImage("img/img-1.jpg")
  .then((img) => {
    currentImg = img;
    console.log("Image 1 loaded");
    return wait(3);
  })
  .then(() => {
    currentImg.style.display = "none";
    return createImage("img/img-2.jpg");
  })
  .then((img) => {
    currentImg = img;
    console.log("Image 2 loaded");
    return wait(3);
  })
  .then(() => {
    currentImg.style.display = "none";
    return createImage("img/img-3.jpg");
  })
  .then((img) => {
    currentImg = img;
    console.log("Image 3 loaded");
    return wait(3);
  })
  .then(() => {
    currentImg.style.display = "none";
  })
  .catch((err) => console.error(err));
