const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    abrirReserva: () => { ipcRenderer.send('abrir-reserva') },
    criarReserva: (Agenda) => ipcRenderer.invoke('criar-reserva', Agenda),
    consultarReservas: (data) => ipcRenderer.invoke('consultar-reserva', data),
    statusReserva: (reserva) => { ipcRenderer.on('status-criacao-reserva', reserva) },
    reservasCadastradas: (reservas) => ipcRenderer.on('reservas-cadastradas', reservas)
})