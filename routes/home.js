const express = require("express"),
  cors = require("cors"),
  fetch = require("node-fetch");

const router = express.Router();

router.use(cors());

//Function to handle retrieving the spotify id for the artist the user searches for
async function getArtistId(artist, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=1`,
    {
      method: "get",
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  const data = await response.json();
  const artist_id = data.artists.items[0].id;
  return artist_id;
}

//Function to handle retrieving the related artists
async function getRelatedArtists(id, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${id}/related-artists`,
    {
      method: "get",
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  const data = await response.json();
  return data;
}

//function to create array of just the related artists' names
function createRelatedArray(response, original) {
  const relatedArray = response.artists;
  let artistsArray = [original];
  relatedArray.forEach(function(artist) {
    artistsArray.push(artist.name);
  });
  return artistsArray;
}

//function that gets a single artist's events
//!!!!! currently only handles one event per band, fix this later
async function getEvents(artist, zip) {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&city=${zip}&apikey=3FhkqehgsJxNsLTInDmAyq0Oo7Vzj5j5`;
  const encode = encodeURI(url);
  const response = await fetch(encode);
  const data = await response.json();
  let eventData = {};
  if (!!data._embedded) {
    const event = data._embedded.events;
    if (!!event[0].dates.start.localTime) {
      const name = event[0].name;
      const venue = event[0]._embedded.venues[0].name;
      const date = event[0].dates.start.localDate;
      const time = event[0].dates.start.localTime;
      const image = event[0].images[0].url;
      const url = event[0].url;
      eventData = { name, venue, date, time, image, url };
    }
  }
  return eventData;
}

//this function filters out duplicate events before sending to the front end
function uniqueFilter(arr, key) {
  const unique = arr
    .map(e => e[key])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e])
    .map(e => arr[e]);
  return unique;
}

//function to get events from ticketmaster
async function getAllEvents(artists, res, zip) {
  let events = [];

  artists.forEach((artist, index) => {
    setTimeout(async () => {
      let event = await getEvents(artist, zip);
      events.push(event);
      if (index == artists.length - 1) {
        const filterArray = events.filter(event => event.name);
        newArray = uniqueFilter(filterArray, "name");
        res.json({ events: newArray });
      }
    }, index * 1000);
  });
}

//request data from spotify
router.get("/scan/:tokenId/:artist/:zip/", async function(req, res, next) {
  const token = req.params.tokenId;
  const artist = req.params.artist;
  const zip = req.params.zip;
  const artist_id = await getArtistId(artist, token);
  const related_data = await getRelatedArtists(artist_id, token);
  const related_artists = await createRelatedArray(related_data, artist);

  await getAllEvents(related_artists, res, zip);
});

module.exports = router;
