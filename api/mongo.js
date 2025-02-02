const mongoose = require('mongoose')
const schema = mongoose.Schema

const agendaSchema = new schema(
    {
        Dia: String,
        Horario: [{
            Titulo: { type: String, required: true },
            HoraInicio: { type: Date, required: true },
            HoraFim: { type: Date, required: true },
            isReservado: { type: Boolean, default: false },
            NomeReserva: { type: String, required: true },
            TelefoneReserva: { type: String, required: true },
            EmailReserva: { type: String },
            Observacoes: { type: String }
        }]

    },
    { timestamps: true } //adiciona hora de create e update
)

const Agenda = mongoose.model('Agenda', agendaSchema, 'Agenda')

async function criarReserva(dadosReserva) {
    let possuiAgendamento = await Agenda.findOne({
        Dia: dadosReserva.Dia,
        Horario: {
            $elemMatch: {
                HoraInicio: { $lt: new Date(dadosReserva.Horario[0].HoraFim) },
                HoraFim: { $gt: new Date(dadosReserva.Horario[0].HoraInicio) }
            }
        }
    })

    if (possuiAgendamento) {
        return 'Já existe um agendamento dentro do intervalo informado.'
    }

    try {
        const resultado = await Agenda.updateOne(
            { Dia: dadosReserva.Dia },
            {
                $push: {
                    Horario: {
                        Titulo: dadosReserva.Horario[0].Titulo,
                        HoraInicio: new Date(dadosReserva.Horario[0].HoraInicio),
                        HoraFim: new Date(dadosReserva.Horario[0].HoraFim),
                        isReservado: true,
                        NomeReserva: dadosReserva.Horario[0].NomeReserva,
                        TelefoneReserva: dadosReserva.Horario[0].TelefoneReserva,
                        EmailReserva: dadosReserva.Horario[0].EmailReserva,
                        Observacoes: dadosReserva.Horario[0].Observacoes
                    }
                }
            },
            { upsert: true }
        )

        console.log('Reserva criada com sucesso.')
        return 'Reserva criada com sucesso.'
    } catch (err) {
        console.error('Erro ao criar a reserva:', err)
        return 'Erro ao criar a reserva.'
    }
}



module.exports = { criarReserva }