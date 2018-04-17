import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 8
};

function popupContent(place) {
  const { slug, photo, location, name } = place;
  return `
 <div class="popup">
  <a href="/store/${slug}">
   <img src="/uploads/${photo || 'store.png'}" alt="${name}"/>
   <p>${name} - ${location.address}</p>
  </a>
 </div>
 `;
}

function loadPlaces(map, lat = 43.2, lng = -79.8) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`).then(res => {
    const places = res.data;
    if (!places.length) {
      alert('no places found!');
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow();

    const markers = places.map(place => {
      const [placeLng, placeLat] = place.location.coordinates;
      const position = { lat: placeLat, lng: placeLng };
      const mark = new google.maps.Marker({ position, map });
      mark.place = place;
      bounds.extend(position);
      return mark;
    });

    markers.forEach(marker =>
      marker.addListener('click', function() {
        infoWindow.setContent(popupContent(this.place));
        infoWindow.open(map, this);
      })
    );

    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
  });
}

function makeMap(mapDiv) {
  if (!mapDiv) return;

  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(
      map,
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );
  });
}

export default makeMap;
