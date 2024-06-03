console.log('❤ Iniciando...')
import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import ora from 'ora'
import { createInterface } from 'readline'
import yargs from 'yargs'

// https://stackoverflow.com/a/50052194
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname) // Incorpora la capacidad de crear el método 'require'
const { name, author, version, description, collaborators } = require(join(__dirname, './package.json')) // https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

let activeCollaborators = 'Colaboradores activos: '
for (const key in collaborators) {
if (collaborators.hasOwnProperty(key)) {
activeCollaborators += collaborators[key] + ', '
}}
activeCollaborators = activeCollaborators.slice(0, -2)

//say('Yartex\nBot\nMD', {
//font: 'block',
//align: 'center',
//colors: ['magenta', 'cyan']
//})

const spinner = ora('Cargando datos...').start()
setTimeout(() => {
spinner.succeed('Datos cargados exitosamente')
}, 2000)


cfonts.say('yartex\nbot md', {
align: 'center',           
gradient: ['red', 'blue'] 
})
say(description, {
font: 'console',
align: 'center',
gradient: ['blue', 'magenta']
})
say(`Desarrollado por: ${author.name}\nCódigo basado de: ${collaborators.col1}\n${activeCollaborators}\nVersion: ${version}`, {
font: 'console',
gradient: ['blue', 'magenta']
})

var isRunning = false

async function start(file) {
if (isRunning) return
isRunning = true
const currentFilePath = new URL(import.meta.url).pathname
let args = [join(__dirname, file), ...process.argv.slice(2)]
say([process.argv[0], ...args].join(' '), {
font: 'console',
align: 'center',
gradient: ['red', 'magenta']
})
setupMaster({exec: args[0], args: args.slice(1),
})
let p = fork()
p.on('message', data => {
switch (data) {
case 'reset':
p.process.kill()
isRunning = false
start.apply(this, arguments)
break
case 'uptime':
p.send(process.uptime())
break
}})

p.on('exit', (_, code) => {
isRunning = false
console.error('⚠️ ERROR ⚠️ >> ', code)
start('main.js')

if (code === 0) return
watchFile(args[0], () => {
unwatchFile(args[0])
start(file)
})})

let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!opts['test'])
if (!rl.listenerCount()) rl.on('line', line => {
p.emit('message', line.trim())
})}

start('main.js')
