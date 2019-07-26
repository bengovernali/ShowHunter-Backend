const db = require("./conn.js");

class Events {
  constructor(id, name, venue, date, time, user) {
    this.id = id;
    this.name = name;
    this.venue = venue;
    this.date = date;
    this.time = time;
    this.user = user;
  }
}
