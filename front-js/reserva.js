const { ipcRenderer } = window.api
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'UTC',
        initialView: 'timeGridDay',
        slotLabelInterval: '01:00',
        slotMinTime: '07:00:00',
        slotMaxTime: '18:00:00',
        contentHeight: 'auto',
        locale: 'pt-br',
        allDaySlot: false,
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'today'
        },
        buttonText: {
            today: 'Hoje'
        },
        editable: true,
        events: '/api/demo-feeds/events.json'
    })

    calendar.render()

    var form = document.getElementById('form-create')
    form.addEventListener('submit', (event) => {
        form.HoraInicio.setCustomValidity("")
        event.preventDefault()
        if (new Date(form.HoraInicio.value) >= new Date(form.HoraFim.value)) {
            form.HoraInicio.setCustomValidity("A data inicio não pode ser menor que a data fim")
            form.reportValidity()
            return
        }
        const Agenda = {
            Dia: new Date(form.HoraInicio.value).toLocaleDateString(),
            Horario: [{
                Titulo: form.Titulo.value,
                HoraInicio: new Date(form.HoraInicio.value),
                HoraFim: new Date(form.HoraFim.value),
                isReservado: true,
                NomeReserva: form.NomeReserva.value,
                TelefoneReserva: form.TelefoneReserva.value,
                EmailReserva: form.EmailReserva.value,
                Observacoes: form.Observacoes.value
            }]

        }
        window.api.criarReserva(Agenda)
    })

    window.api.statusReserva((event,message)=>{
        console.log(message)
    })

})