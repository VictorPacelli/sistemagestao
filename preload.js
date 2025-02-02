const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('api',{
criarReserva: (Agenda)=> ipcRenderer.invoke('criar-reserva', Agenda),
abrirReserva: () =>{ipcRenderer.send('abrir-reserva')},
statusReserva: (reserva) =>{ipcRenderer.on('status-criacao-reserva', reserva)}
})