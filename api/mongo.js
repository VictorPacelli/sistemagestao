const mongoose = require('mongoose')
const schema = mongoose.Schema

const agendaSchema = new schema(
    {
        Dia: Date,
        Horario:[{
            Data: {type:Date, required: true},
            isReservado:{type:Boolean, default: false},
            NomeReserva: {type: String, required: true},
            TelefoneReserva: {type:String, required:true},
            EmailReserva: {type:String},
            Observacoes: {type:String}
        }]
        
    },
    {timestamps: true} //adiciona hora de create e update
)

const Agenda = mongoose.model('Agenda', agendaSchema, 'Agenda')

async function criarReserva(){
    try {
        await Agenda.create({
            Dia: new Date('2025-01-28'),
            Horario: [{
                Data: new Date('2025-01-30T09:00:00Z'),
                isReservado: true,
                NomeReserva: 'Victor',
                TelefoneReserva: '(31) 98593-3944',
                EmailReserva: 'victorapfa@gmail.com',
                Observacoes: 'está com pressa'
            }]          
        })
    } catch(err){
        console.error(err)
    }
}
module.exports = {criarReserva}