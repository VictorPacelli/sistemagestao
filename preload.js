const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('api',{
criarReserva: ()=> ipcRenderer.invoke('criar-reserva')
})