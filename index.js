import makeWASocket,{useMultiFileAuthState,fetchLatestBaileysVersion}from"@whiskeysockets/baileys"
import P from"pino"
import readline from"readline"
const rl=readline.createInterface({input:process.stdin,output:process.stdout})
const q=t=>new Promise(r=>rl.question(t,r))
async function startBot(){
const {state,saveCreds}=await useMultiFileAuthState("auth")
const{version}=await fetchLatestBaileysVersion()
const sock=makeWASocket({logger:P({level:"silent"}),printQRInTerminal:!1,auth:state,version,browser:["Aro","Chrome","1"]})
sock.ev.on("creds.update",saveCreds)
if(!sock.authState.creds.registered){
const num=await q("NUMBER 9471...: ")
const code=await sock.requestPairingCode(num.trim())
console.log("PAIR CODE: "+code)
}
sock.ev.on("connection.update",u=>{if(u.connection==="open"){console.log("OK CONNECTED");rl.close()}})
sock.ev.on("messages.upsert",async m=>{
const msg=m.messages[0]
if(!msg.message||msg.key.fromMe)return
const from=msg.key.remoteJid
const body=msg.message.conversation||""
if(body==".menu")await sock.sendMessage(from,{text:"*ARO SITHU BOT MENU*\n.menu\n.alive\n.ping"})
if(body==".alive")await sock.sendMessage(from,{text:"*ACTIVE ✅*"})
if(body==".ping")await sock.sendMessage(from,{text:"*Pong!*"})
})
}
startBot()
