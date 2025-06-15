if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
  alert("Geolocation is not supported by this browser.");
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const alt = position.coords.altitude !== null ? position.coords.altitude + ' m' : 'Unavailable';

  fetchNearbySkiResortsWithJQuery(lat, lng);

  $('#latitude').text(lat.toFixed(5));
  $('#longitude').text(lng.toFixed(5));
  $('#altitude').text(alt);

  const map = L.map('map').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([lat, lng]).addTo(map)
    .bindPopup("You are here!")
    .openPopup();
}

function showError(error) {
  let message = "Geolocation error.";
  switch(error.code) {
    case error.PERMISSION_DENIED: message = "User denied the request for Geolocation."; break;
    case error.POSITION_UNAVAILABLE: message = "Location information is unavailable."; break;
    case error.TIMEOUT: message = "The request to get user location timed out."; break;
  }
  alert(message);
}


function getDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula
  const toRad = angle => angle * (Math.PI / 180);
  const R = 3958.8; // radius of Earth in miles

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function fetchNearbySkiResortsWithJQuery(userLat, userLng) {
  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort',
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '0fa42adbcbmsh4afc7305119dd38p1fa337jsn019c3655737d',
      'X-RapidAPI-Host': 'ski-resorts-and-conditions.p.rapidapi.com'
    }
  };

$.ajax(settings).done(function (resorts) {
  console.log('API Response:', resorts);

  $('#resort-list').empty();

  const resortArray = resorts.data; // ✅ Fix: get the array of resorts
  console.log('Sample resort object:', resortArray[0]);


  const nearbyResorts = resortArray
    .map(resort => {
      const rLat = parseFloat(resort.location.latitude);
      const rLon = parseFloat(resort.location.longitude);
      const distance = getDistance(userLat, userLng, rLat, rLon);
      return { ...resort, distance };
    })
    .filter(resort => resort.distance <= 1000)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);
  

  if (nearbyResorts.length === 0) {
    $('#resort-list').html('<p>No ski resorts found nearby.</p>');
    return;
  }

  const $list = $('<ul class="resort-list"></ul>');
  nearbyResorts.forEach(resort => {
    const $item = $(`<li>${resort.name} – ${resort.country} (${resort.distance.toFixed(1)} mi)</li>`);
    $list.append($item);
  });

  $('#resort-list').append('<h3>Nearby Ski Resorts:</h3>').append($list);

}).fail(function (xhr, status, error) {
  console.error('XHR status:', xhr.status);
  console.error('XHR responseText:', xhr.responseText);
  console.error('Error thrown:', error);
  $('#resort-list').html(`<p>Failed to load ski resort data. Error ${xhr.status}: ${xhr.statusText}</p>`);
});
}
