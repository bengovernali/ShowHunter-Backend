const db = require("./conn.js");

class Token {
  constuctor(id, token) {
    this.id = id;
    this.token = token;
  }

  static async createToken(token) {
    const query = `INSERT INTO tokens (token) VALUES ('${token}');`;

    try {
      let response = await db.result(query);
      console.log("TOKEN INSERTED", response);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async getTokenId(token) {
    try {
      const response = await db.one(
        `SELECT id FROM tokens WHERE token = '${token}';`
      );
      return response;
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Token;