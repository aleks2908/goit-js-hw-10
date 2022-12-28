import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
input.addEventListener('input', debounce(onInput, 300));

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function onInput(evt) {
  if (evt.target.value) {
    fetchCountries(evt.target.value.trim())
      .then(resp => {
        if (!resp.ok) {
          countryList.innerHTML = '';
          countryInfo.innerHTML = '';
          Notiflix.Notify.failure('Oops, there is no country with that name');
          throw new Error(resp.statusText);
        }
        return resp.json();
      })
      .then(data => createMarkup(data))
      .catch(err => console.log(err));
  } else {
    countryList.innerHTML = '';
  }
}

function createMarkup(data) {
      const {
        flags: { svg },
        name: { official },
        capital,
        population,
        languages,
      } = data[0];

  if (!data.length) {
    countryList.innerHTML = '';
    Notiflix.Notify.failure('Oops, there is no country with that name');
    alert('нічого не знайдено');
  } else if (data.length > 10) {
    countryList.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length === 1) {
 
    // const {
    //   flags: { svg },
    //   name: { official },
    //   capital,
    //   population,
    //   languages,
    // } = data[0];

    countryList.innerHTML = '';
    countryInfo.innerHTML = `<div class='title'><img src="${svg}" alt="${official}" width=80 height=50><h1>${official}</h1></div>
    <span>Capital: </span>${capital}<br>
    <span>Population: </span>${population}<br>
    <span>Languages: </span>${Object.values(languages).join(', ')}`;
  } else {
    countryInfo.innerHTML = '';
    const markup = data
      .map(
        ({ flags: { svg }, name: { official } }) =>
          `<li><img src="${svg}" alt="${official}" width=80 height=50><h2>${official}</h2></li>`
      )
      .join('');
    countryList.innerHTML = markup;
  }
}