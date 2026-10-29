import makeWASocket,{useMultiFileAuthState,fetchLatestBaileysVersion}from"@whiskeysockets/baileys"
import P from"pino"
const phone=process.env.NUMBER||""
async function startBot(){
const {state,saveCreds}=await useMultiFileAuthState("auth")
const{version}=await fetchLatestBaileysVersion()
const sock=makeWASocket({logger:P({level:"silent"}),printQRInTerminal:!1,auth:state,version,browser:["Aro","Chrome","1"]})
sock.ev.on("creds.update",saveCreds)
if(!sock.authState.creds.registered){
if(!phone){console.log("SET NUMBER ENV");return}
const code=await sock.requestPairingCode(phone.trim())
console.log("PAIR CODE FOR "+phone+": "+code)
}
sock.ev.on("connection.update",u=>{if(u.connection==="open")console.log("CONNECTED OK")})
sock.ev.on("messages.upsert",async m=>{
const msg=m.messages[0]
if(!msg.message||msg.key.fromMe)return
const from=msg.key.remoteJid
const body=msg.message.conversation||msg.message.extendedTextMessage?.text||""
if(body==".menu")await sock.sendMessage(from,{text:"*ARO SITHU BOT*\n.menu\n.alive\n.ping"})
if(body==".alive")await sock.sendMessage(from,{text:"*ACTIVE ✅*"})
if(body==".ping")await sock.sendMessage(from,{text:"Pong! 🏓"})
})
}
startBot()
