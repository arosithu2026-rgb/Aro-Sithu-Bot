import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import P from 'pino'

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ['Aro Sithu Bot', 'Chrome', '1.0.0']
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            if(shouldReconnect) { startBot() }
        } else if(connection === 'open') {
            console.log('✅ ARO SITHU BOT CONNECTED!')
        }
    })
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if(!msg.message) return
        if(msg.key.fromMe) return
        const from = msg.key.remoteJid
        const type = Object.keys(msg.message)[0]
        const body = type === 'conversation' ? msg.message.conversation : type === 'extendedTextMessage' ? msg.message.extendedTextMessage.text : ''
        if(!body.startsWith('.')) return
        const command = body.slice(1).trim().split(' ').shift().toLowerCase()
        if(command === 'menu') {
            await sock.sendMessage(from, { text: '*╭───〔 ARO SITHU OFC 〕───*\n*│*\n*│* 👑 OWNER: ARO SITHU\n*│* 🤖 BOT: MINI BOT\n*│* ⚡ VERSION: 1.0.0\n*│*\n*╰────────────────*\n\n*📜 COMMANDS*\n.menu - Menu\n.alive - Alive\n.ping - Ping\n.owner - Owner\n\n_© ARO SITHU OFC_' })
        }
        if(command === 'alive') {
            await sock.sendMessage(from, { text: '*ARO SITHU BOT ACTIVE ✅🔥*' })
        }
        if(command === 'ping') {
            await sock.sendMessage(from, { text: '*Pong! 🏓*' })
        }
        if(command === 'owner') {
            await sock.sendMessage(from, { text: '*👑 OWNER: ARO SITHU OFC*' })
        }
    })
}
startBot()
