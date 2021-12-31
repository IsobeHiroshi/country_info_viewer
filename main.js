/* Initiate an array to store country data fetched from API*/
let fetchedCountries = [];

/* Store UI elements in variables */
const getCountriesBtn = document.getElementById('getCountriesBtn');
const outputArea = document.getElementById('outputArea');
const outputList = document.getElementById('outputList');
const region = document.getElementById('region');
const infoOverlay = document.getElementById('infoOverlay');
const infoOverlayInner = document.getElementById('infoOverlay-inner');

/* Fetch country data from API and store it in "fetchedCountries" */
const getCountries = async ()=> {
    const SelectedRegion = region.value;
    const fetchCountriesUrl = `https://restcountries.com/v3.1/region/${SelectedRegion}`;
    await fetch(fetchCountriesUrl).then((result)=>{
        return result.json();
    }).then((json)=>{
        fetchedCountries = json;
    }).catch((error)=> {
        console.log(error.message);
    });
};

/* Render country list in the UI */
const renderCountryList = ()=> {
    for (let i=0; i < fetchedCountries.length; i++) {
        const listItem = document.createElement('li');
        listItem.setAttribute('class', `listed-countries`)
        outputList.appendChild(listItem);
        listItem.innerHTML = fetchedCountries[i].name.common;
    }
}

/* Show an overlay window with country info*/
const showCountryInfo = ()=> {
    /* Get all the list items in the UI */
    const listedCountries = document.querySelectorAll('.listed-countries');
    /* Add event listener to all of the list items */
    for (let i=0; i < listedCountries.length; i++) {
        listedCountries[i].addEventListener('click', ()=> {
            /* If the overlay is already shown, just close it */
            if (infoOverlay.classList.contains('show')) {
                infoOverlay.classList.remove('show');
                infoOverlayInner.innerHTML = "";
            } else {
                infoOverlay.classList.add('show');
                /* Add commas for numbers */
                const numWithComma = new Intl.NumberFormat();
                let formattedPopulation = numWithComma.format(fetchedCountries[i].population)
                let formattedArea = numWithComma.format(fetchedCountries[i].area)
                /* Get the first currency code */
                let currencies = [];
                for (key in fetchedCountries[i].currencies) {
                    currencies.push(key);
                }
                /* Create elements in the overlay */
                const nameOverlay = document.createElement('p');
                const capitalOverlay = document.createElement('p');
                const populationOverlay = document.createElement('p');
                const areaOverlay = document.createElement('p');
                const currencyOverlay = document.createElement('p');
                const flagLabel = document.createElement('p');
                const flagImg = document.createElement('img');
                const countryMap = document.createElement('a');
                const closeOverlay = document.createElement('p');

                nameOverlay.innerHTML = `<b>Name</b>: ${fetchedCountries[i].name.common}`;
                capitalOverlay.innerHTML = `<b>Capital</b>: ${fetchedCountries[i].capital}`;
                populationOverlay.innerHTML = `<b>Population</b>: ${formattedPopulation}`;
                areaOverlay.innerHTML = `<b>Area</b>: ${formattedArea}km<sup>2</sup>`;
                currencyOverlay.innerHTML = `<b>Currency</b>: ${currencies[0]}`;

                flagLabel.setAttribute('id', 'flagLabel');
                flagLabel.innerHTML = '<b>Flag:</b>';
                flagImg.setAttribute('src',`${fetchedCountries[i].flags.svg}`);

                countryMap.innerHTML = "Open in Google Map";
                countryMap.setAttribute('href',`${fetchedCountries[i].maps.googleMaps}`);
                countryMap.setAttribute('target','_blank');

                closeOverlay.setAttribute('id','closeOverlay');
                closeOverlay.innerHTML = 'close';

                infoOverlayInner.appendChild(nameOverlay);
                infoOverlayInner.appendChild(capitalOverlay);
                infoOverlayInner.appendChild(populationOverlay);
                infoOverlayInner.appendChild(areaOverlay);
                infoOverlayInner.appendChild(currencyOverlay);
                infoOverlayInner.appendChild(flagLabel);
                infoOverlayInner.appendChild(flagImg);
                infoOverlayInner.appendChild(countryMap);
                infoOverlayInner.appendChild(closeOverlay);
                /* Click "close" to close the overlay */
                closeOverlay.addEventListener('click', () => {
                    infoOverlay.classList.toggle('show');
                    infoOverlayInner.innerHTML = "";
                }
            )}
        })
    }
}

/* Click "Get Countries in the Selected Region" button to render the list*/
getCountriesBtn.addEventListener('click', ()=> {
    if (region.value === "") {
        alert('Please Select A Region.')
    } else {
        outputList.innerHTML = "";
        getCountries().then(()=> {
            renderCountryList();
            showCountryInfo();
        });
    }
});
