const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
const { criarReserva, consultarReservas } = require('./api/mongo.js');

mongoose.connect(process.env.MONGOOSE_URL)
    .then(() => { console.log('conectado ao Mongo') })
    .catch((err) => { console.error(err) })

var MainWindow

const newWindow = () => {
     MainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    })
    MainWindow.loadFile('html/index.html')
    MainWindow.once('ready-to-show', () => {
        MainWindow.maximize()
        //MainWindow.webContents.openDevTools()
        MainWindow.show()
    })

}
ipcMain.handle('criar-reserva', async (event,Agenda) => {
    let reserva = await criarReserva(Agenda)
    event.sender.send('status-criacao-reserva', reserva)
})

ipcMain.handle('consultar-reserva', async (event,data) =>{
    let reservas = await consultarReservas(data)
    event.sender.send('reservas-cadastradas', reservas)
})

ipcMain.on('abrir-reserva',()=>{
    MainWindow.loadFile('html/reserva.html')
})

app.whenReady().then(() => {
    newWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) newWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})