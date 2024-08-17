import { help } from './commands/help';
import { about } from './commands/about';
import { chat } from './commands/chat';
import { goroku } from './commands/goroku';
import { join } from './commands/voice/join';

export async function cmd(cmdname: string, client: any, interaction: any): Promise<[string, { embed: Record<string, any> }]> {
    console.log(cmdname);
    if (cmdname === 'help') {
        return help();
    } else if (cmdname === 'about') {
        return about(client);
    }
    else if (cmdname === 'chat') {
        return chat(interaction);
    }
    else if (cmdname === 'goroku') {
        return goroku(interaction);
    } else if (cmdname === 'join') {
        return join(interaction);
    }
    return ["embed", { embed: { color: 16757683, description: 'This is a test' } }];
}
