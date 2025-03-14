import { Schema } from "mongoose";
import mongoose from "mongoose";

const Agenda= new Schema({
	assunto:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	date:{
		type:Date,
		required:true
	},
})

mongoose.model("agendas",Agenda)
export default Agenda;
