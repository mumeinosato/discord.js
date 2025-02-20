import { getVoiceConnection } from '@discordjs/voice';

export async function bye(interaction: any): Promise<[string, { embed: Record<string, any> }]> {
    const voiceChannel = interaction.member.voice.channel;
    let emobj: { embed: Record<string, any> } = { embed: {} };
    const type = 'embed';

    if (voiceChannel?.type === 2) {
        if (!voiceChannel && voiceChannel?.type !== 2) {
            emobj = {
                embed: {
                    color: 0x4169e1,
                    description: 'ボイスチャンネルに接続してください'
                }
            };
        } else {
            const connection = getVoiceConnection(voiceChannel.guild.id);
            if (connection) {
                connection.destroy();
                emobj = {
                    embed: {
                        color: 0x4169e1,
                        description: 'ボイスチャンネルから退出しました'
                    }
                };
            } else {
                emobj = {
                    embed: {
                        color: 0xff0000,
                        description: 'ボイスチャンネルに接続されていません'
                    }
                };
            }
        }
    } else {
        emobj = {
            embed: {
                color: 0x4169e1,
                description: 'このコマンドはボイスチャンネルでのみ使用できます'
            }
        };
    }

    return [type, emobj];
}
