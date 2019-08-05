const db = require("./conn.js");

class Token {
  constuctor(id, token) {
    this.id = id;
    this.token = token;
  }

  static async createToken(token) {
    const query = `INSERT INTO tokens (token) VALUES ('${token}');`;

    console.log("CREATING TOKEN ", token);

    try {
      let response = await db.result(query);
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
      console.log("GET TOKEN ID RESPONSE IS: ", response);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async getTokenById(token_id) {
    try {
      const response = await db.one(
        `SELECT token FROM tokens WHERE id = '${token_id}';`
      );
      console.log("TOKEN ID IS: ", response);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async deleteToken(tokenId) {
    try {
      const response = await db.result(
        `DELETE FROM tokens WHERE id = '${tokenId}';`
      );
      return response;
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Token;
