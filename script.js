'use strict';

// put your own value below!
const apiKey = 'ibvby8VdRq2bIisZYpEQitjHgTO9z0srOkc0XAS0'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  
  console.log(responseJson);
  
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>Description: ${responseJson.data[i].description}</p>
      <p>Address: ${responseJson.data[i].addresses[0].line1} ${responseJson.data[i].addresses[0].line2} ${responseJson.data[i].addresses[0].line3} ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
      <p><a href='${responseJson.data[i].url}' target="_blank">Visit their website</a></p>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getParks(query, maxResults=10) {
  if (maxResults >=1 && maxResults <= 50) {
  const params = {
    stateCode : query,
    fields : 'addresses',
    limit : maxResults,
    api_key: apiKey
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
    } else {
      alert("Results must be between 1 and 50");
    }

}

function watchForm() {
  //console.log("init");
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val().replace(/[ ,]+/g, ",");
    
    console.log(searchTerm);
    const maxResults = $('#js-max-results').val();
    getParks(searchTerm, maxResults);
  });
}

$(watchForm);