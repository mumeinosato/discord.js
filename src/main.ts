//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, ActivityType, Attachment } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice';
require('dotenv').config();
import { setcmd } from './register_cmd'
import { cmd } from './cmd'
import { sendRequestChat } from './api/chatapi'
import { checkJson } from './json/checkjson';
const fs = require('fs');

//Botで使うGatewayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
})


//Botがきちんと起動したか確認
client.once('ready', async () => {
  await setcmd();
  if (process.env.devMode == 'ture') {
    client.user?.setActivity(`テストバージョン | 導入サーバー数: ${client.guilds.cache.size}`, { type: ActivityType.Playing })
  } else {
    client.user?.setActivity(`導入サーバー数: ${client.guilds.cache.size}`, { type: ActivityType.Playing })
  }

  console.log('Ready!')
  if (client.user) {
    console.log(client.user.tag)
  }
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const [type, obj] = await cmd(interaction.commandName, client, interaction);
  if (type === "embed") {
    interaction.reply({ embeds: [obj.embed] });
  } else if (type === "epre") {
    interaction.reply({ embeds: [obj.embed], ephemeral: true });
  }
});

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return
  const sendText = message.content;

  const member = message.member;
  if(member){
    const voiceChannel = member.voice.channel;
    if (sendText === 'join') {
      if(voiceChannel?.type === 2){
        if (!voiceChannel) {
          message.reply('ボイスチャンネルに接続してください');
          return;
        }
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
      } else {
        message.reply('このコマンドはボイスチャンネルでのみ使用できます');
        return;
      }
    }
  }

  const isin = checkJson(message.channel.id);

  let image = '';

  if (message.attachments.size > 0) {
    message.attachments.forEach(attachment => {
      image = attachment.url;
    })
  }

  if (isin === true) {
    try {
      const result = await sendRequestChat(sendText + image)
      message.reply(result)
    } catch (error) {
      console.error(error)
      message.reply('エラーが発生しました')
    }
  } else {
    await sendRequestChat(sendText + image)
  }
})

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)
