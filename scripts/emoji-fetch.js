/**
 * Fetches Emoji data from:
 * https://www.unicode.org/Public/emoji/11.0/emoji-test.txt
 */

const request = require('request');
const firebase = require('firebase');

const EMOJI_UNICODE_ORG_URI = 'https://www.unicode.org/Public/emoji/11.0/emoji-test.txt';

const config = {
  apiKey: "AIzaSyCqujfrhjfncjFbRTqnU1EG_aeq-sOGsew",
  authDomain: "emoji-lookup.firebaseapp.com",
  databaseURL: "https://emoji-lookup.firebaseio.com",
  projectId: "emoji-lookup",
  storageBucket: "emoji-lookup.appspot.com",
  messagingSenderId: "169988007957"
};
firebase.initializeApp(config);
const database = firebase.database();

class EmojiFetch {
  constructor(database, ref) {
    this.emojiData;

    /** @private @const {string} */
    this.rawDataStr_;

    this.databaseRef = ref;

    this.database = database;

    this.init();
  }

  init() {
    request(EMOJI_UNICODE_ORG_URI, (error, response, body) => {
      console.log('😀 Downloaded emoji data from', EMOJI_UNICODE_ORG_URI);
      this.rawDataStr_ = body;
      this.emojiData = this.parseRawData_(this.rawDataStr_);
      this.commit();
    });
  }

  commit() {
    database.ref(this.databaseRef).set(this.emojiData).then(() => {
      console.log('😀 Commit to', this.databaseRef);
      database.goOffline();
      console.log('OK 👍🏻');
    });
  }

  /** @private */
  parseRawData_(rawData) {
    const emojiData = [];
    let emojiGroupData = [];
    let groupTotal = 0;
    let emojiTotal = 0 ;

    const groupMatch = (line) => {
      const match = line.match(/^#\sgroup:\s+(.*)/);
      if (match) return match[1];
    };
    const emojiLineMatch = (line) => {
      const match = line.match(/;.*#/) && line.indexOf('#') !== 0;
      const stripUnicodeChars = (str) => str.replace(/[^\x00-\x7F]/g, '');
      if (match) {
        const split = line.split(/(;|#)/);
        return [split[0].trim(), stripUnicodeChars(split[4]).trim()];
      }
    }

    this.rawDataStr_.split('\n').forEach((line) => {
      const groupName = groupMatch(line);
      if (groupName) {
        emojiGroupData = [];
        emojiGroupData[0] = groupName;
        emojiGroupData[1] = [];
        emojiData.push(emojiGroupData);
        groupTotal++;
      }

      const emojiLineData = emojiLineMatch(line);
      if (emojiLineData) {
        emojiGroupData[1].push(emojiLineData);
        emojiTotal++;
      }
    });

    console.log('😀 Parsed', emojiTotal, 'emojies in', groupTotal, 'groups');
    return emojiData;
  }
}

new EmojiFetch(database, 'global/emojiData');
