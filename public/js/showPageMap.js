mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: campsite.geometry.coordinates,
    zoom: 10
  });

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(campsite.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${campsite.title}</h3><p>${campsite.location}</p>`
      )
  )
  .addTo(map)
