const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
const { criarReserva } = require('./api/mongo.js');

mongoose.connect(process.env.MONGOOSE_URL)
    .then(() => { console.log('conectado ao Mongo') })
    .catch((err) => { console.error(err) })

const newWindow = () => {
    const window = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    })
    window.loadFile('html/index.html')
    window.once('ready-to-show', () => {
        window.maximize()
        //window.webContents.openDevTools()
        window.show()
    })

}
ipcMain.handle('criar-reserva', async () => {
    await criarReserva()
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