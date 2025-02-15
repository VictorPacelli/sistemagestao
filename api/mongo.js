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
    { timestamps: true }, //adiciona hora de create e update
    { _id: true } 
)

const Agenda = mongoose.model('Agenda', agendaSchema, 'Agenda')

async function criarReserva(dadosReserva) {
    var status
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
        status = {status: 409, id: null, message:'Já existe um agendamento dentro do intervalo informado.'}
        return status
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
        status = {status: 200, id: resultado.upsertedId, message: 'Agendamento realizado com sucesso'}
        return status
    } catch (err) {
        status = {status: 500, id: null, message: err}
        return status
    }
}

async function consultarReservas(data){
    try{
      let agendamentos =  await Agenda.findOne({Dia : data})
      return agendamentos ? agendamentos.toJSON() : null; 

    } catch(err){
        console.error(err)
        return null
    }
}

module.exports = { criarReserva, consultarReservas }