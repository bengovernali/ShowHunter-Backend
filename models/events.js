const db = require("./conn.js");

class Events {
  constructor(id, name, venue, date, time) {
    this.id = id;
    this.name = name;
    this.venue = venue;
    this.date = date;
    this.time = time;
  }

  static async createEvent(name, venue, date, time, token_id) {
    const query = `INSERT INTO events (name, venue, event_date, event_time, token_id) VALUES ('${name}', '${venue}', '${date}', '${time}', ${token_id});`;

    try {
      let response = await db.result(query);
      console.log("model", response);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async getEvents(token_id) {
    try {
      console.log("TOKEN ID FROM DB CALL: ", token_id);
      console.log(typeof token_id);
      const response = await db.one(
        `Select (name, venue, event_date, event_time) FROM events WHERE token_id = ${token_id}`
      );
      console.log("EVENTs FROM DB CALL: ", response);
      return response;
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Events;
