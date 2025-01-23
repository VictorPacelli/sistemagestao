const { app, BrowserWindow } = require('electron')

const newWindow = () => {
    const window = new BrowserWindow({
        show: false
    })
    window.loadFile('html/index.html')
    window.once('ready-to-show', () => {
        window.maximize()
        window.show()
    })

}

app.whenReady().then(() => {
    newWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) newWindow()
    })
})

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin')app.quit()
})