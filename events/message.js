const Discord = require("discord.js"), cooldowns = new Discord.Collection(), db = require("quick.db");

module.exports = async (client, message) => {
  if (message.author.bot || message.author === client.user) return;
  
  if (message.channel.type === "dm") return;
  
  let prefix = client.config.prefix; 
  
  if (!message.content.startsWith(prefix)) return;
  
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let msg = message.content.toLowerCase();
  let cmd = args.shift().toLowerCase();
  let sender = message.author;
  
  message.flags = []
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1)); 
  }
  
  let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!commandFile) return; 
  
  if (!cooldowns.has(commandFile.help.name)) cooldowns.set(commandFile.help.name, new Discord.Collection());
  
  const member = message.member,
        now = Date.now(),
        timestamps = cooldowns.get(commandFile.help.name),
        cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;
  
  if (!timestamps.has(member.id)) {
    if (!client.config.owners.includes(message.author.id)) {
      timestamps.set(member.id, now);
    }
  } else {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.channel.send(`Calm down dude, please wait **${timeLeft.toFixed(1)}** seconds to try the command again.`);
    }
    
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount); 
  }
  
  try {
    if (!commandFile) return;
    commandFile.run(client, message, args);
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log(`${sender.tag} (${sender.id}) ran a command: ${cmd}`);
  }
}