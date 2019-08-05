# ShowHunter

ShowHunter takes an artist and city as input and returns a series of upcoming events in the area for that artist's Spotify related artists. The back end is written in Node and the front end is written in React.

## Login

Upon reaching the front page, the user sees the site logo and a green 'Login With Spotify' button. This project utilizes Spotify to create related artist data. In order to do this, Spotify authorization flow is required. The user is redirected to a Spotify login page, and upon completion of login is redirected to the ShowHunter home page.

Auth tokens received during login are stored in a database on the same server that Node is run on. These tokens can only be used for 10 minutes and are deleted from the database upon logout. Rather than send these tokens directly to the front end, ShowHunter sends the Id they are assigned to the home page. This becomes important when searching through artist data later.

## Event Search

The user enters an artist and a city into the search form. This triggers a series of functions that result in a set of event cards being displayed on the front end. On clicking the submit button, the artist, city, and token Id are sent to the back end. ShowHunter searches the database for a token that matches that token Id. It then runs a search for the artist's Spotify Id, which is used to find the related artists. With an array of 21 artists (including the artist searched), ShowHunter then makes a series of API requests to Ticketmaster, requesting any events for those artists in the desired city. If it finds one, it creates an object with the event name, venue, date, time, ticket purchase url, and image url. These will be stored in an array of events that are then sent to the front end as a json object to create cards.

Ticketmaster has a limit to how many requests can be made to their API at once, so a timeout of 1 second is used for each request. This leads the entire search process to last no less than 21 seconds.

## Logout

A logout button is also displayed on the home page. When the user is done with ShowHunter, the logout button will trigger a deletion of their token from the database and redirect to the front page.

## Technologies

ShowHunter is written using a React front end and Node back end. The back end was created using express-generator.
