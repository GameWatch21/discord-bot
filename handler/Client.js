const {Client, Collection} = require("discord.js");

module.exports = class TutorialBot extends Client {
  constructor(options) {
    super(options)

    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.aliases = new Collection();
    this.config = require('../config.json');
    this.package = require("../package.json");
    this.recent = new Set();
  }
}