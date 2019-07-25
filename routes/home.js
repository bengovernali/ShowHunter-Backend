const express = require("express"),
  request = require("request"),
  fetch = require("node-fetch");

const router = express.Router();

async function mapArtistIds(data, array) {
  return data.map(item => array.push(item.track.album.artists[0].id));
}

//request data from spotify
router.get("/scan/:bearer", async function(req, res, next) {
  let user_artists = [];
  let related_artists = [];

  const bearer = req.params.bearer;
  const authOptions = {
    url: `https://api.spotify.com/v1/me/tracks?&limit=50`,
    headers: { Authorization: `Bearer ${bearer}` },
    json: true
  };

  await request.get(authOptions, async (error, response, body) => {
    if (error) throw new Error(error);

    //create an array of artist ids from the first 50 tracks in a users spotify library
    await mapArtistIds(body.items, user_artists);
    console.log(user_artists);

    //create an array of related artists
    /*
    user_artists.forEach(id => {
      const authOptions2 = {
        url: `https://api.spotify.com/v1/artists/${id}/related-artists`,
        headers: { Authorization: `Bearer ${bearer}` },
        json: true
      };

      request.get(authOptions2, (error, response, body) => {
        body.artists.map(artist => related_artists.push(artist.name));
      });
    });
    */
  });
});

module.exports = router;
