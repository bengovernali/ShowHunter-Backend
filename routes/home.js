const express = require("express"),
  request = require("request"),
  fetch = require("node-fetch");

const router = express.Router();

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
function createRelatedArray(response) {
  const relatedArray = response.artists;
  let artistsArray = [];
  relatedArray.forEach(function(artist) {
    artistsArray.push(artist.name);
  });
  return artistsArray;
}

//function that gets a single artist's events
//!!!!! currently only handles one event per band, fix this later
async function getEvents(artist) {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&city=atlanta&apikey=3FhkqehgsJxNsLTInDmAyq0Oo7Vzj5j5`;
  const response = await fetch(url);
  const data = await response.json();
  if (!!data._embedded) {
    const event = data._embedded.events;
    const name = event[0].name;
    const venue = event[0]._embedded.venues[0].name;
    const date = event[0].dates.start.localDate;
    const time = event[0].dates.start.localTime;
    const eventData = { name, venue, date, time };
    return eventData;
  }
}

//function that gets triggered at the end of the getAllEvents interval
function arrayOfEvents(events) {
  console.log("EVENTS IN CALLBACK ARE", events);
  return events;
}

//function to get events from ticketmaster
function getAllEvents(artists) {
  let events = [];
  end = artists.length - 1;
  count = 0;
  const intervalObject = setInterval(async () => {
    if (count == end) {
      clearInterval(intervalObject);
      arrayOfEvents(events);
    }
    let response = await getEvents(artists[count]);
    if (response !== undefined) {
      events.push(response);
    }
    count++;
  }, 1000);
}

//request data from spotify
router.get("/scan/:token/:artist", async function(req, res, next) {
  const token = req.params.token;
  const artist = req.params.artist;

  const artist_id = await getArtistId(artist, token);
  const related_data = await getRelatedArtists(artist_id, token);
  const related_artists = await createRelatedArray(related_data);
  const events = await getAllEvents(related_artists);
});

module.exports = router;
