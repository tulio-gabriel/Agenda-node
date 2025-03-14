import express from 'express';
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import handlebars from 'express-handlebars';
import { engine } from 'express-handlebars';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import Agenda from './models/Agenda.js';
const Agendas = mongoose.model("agendas");
import flash from 'connect-flash';

const adminEmail="emailModel@gmail.com"
const adminPass="EmailPass"
const app = express();
//config
//sessao
app.use(session({
	secret: "curso de node",
	resave: true,
	saveUninitialized: true
	}))
	app.use(flash())
	//midleware
	app.use((req, res, next)=>{
	  res.locals.success_msg = req.flash("success_msg")
	  res.locals.error_msg= req.flash("error_msg")
	  res.locals.error=req.flash("error")
	  res.locals.user = req.user || null
	  next()
	})  
  //body parser
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  //handlebars
  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");
  //Public
  app.use(express.static(path.join(__dirname, "public")));
  
app.use(express.static(path.join(__dirname, 'public')));

app.post('/', (req, res) => {
	const date = req.body.date;
	const email = req.body.email;
	const assunto = req.body.assunto;
	req.session.date = date; // Set the name in the session
	req.session.email = email; // Set the email in the session
	req.session.assunto = assunto; // Set the assunto in the sessio

	  let erros = [];
	if (
	  !date ||
	  typeof date == undefined ||
	  date == null
	) {
	  erros.push({ texto: "data invalida" });
	}
  
	if (
	  !email ||
	  typeof email == undefined ||
	  email== null
	) {
	  erros.push({ texto: "email invalido" });
	}

	if(
		!assunto ||
		typeof assunto == undefined ||
		assunto == null
	){
		erros.push({texto: "Assunto invalido"})
	}
	
  
	if (erros.length > 0) {
	  res.render("index", { erros: erros });
	} else {
	  const novaAgenda = {
		assunto: assunto,
		email: email,
		date: date,
	  };
  
	  new Agendas(novaAgenda)
		.save()
		.then(() => {
		  req.flash("success_msg", "Categoria criada com sucesso");
		  res.redirect("/");
		})
		.catch((err) => {
		  req.flash(
			"error_msg",
			"Houve um erro ao salvar a categoria, tente novamente"
		  );
		  console.log("erro: " + err);
		  res.redirect('/');
		});
					// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: adminEmail, // Replace with your email
        pass: adminPass // Replace with your email password
    }
});

// Email options
let mailOptions = {
	from: adminEmail, // Sender address
	to: email, // List of recipients
	subject: 'Agenda', // Subject line
	text: 'seu compromisso', // Plain text body
	html: `Não se esquece de seu compromisso: <b>${req.session.assunto}</b> na data: <b>${req.session.date}</b>`
}

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(`Error: ${error}`);
    }
    console.log(`Message Sent: ${info.response}`);
});
	};
})

app.get('/', (req, res) => {
	const date = req.session.date
	const email = req.session.email
	const assunto = req.session.assunto
	Agendas.find()
    .lean()
    .sort({ date: "desc" })
    .then((agendas) => {
      res.render("index", { agendas:agendas });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao registrar as postagens");
      res.redirect("/");
    });
})

app.post("/deletar/:id", (req, res) => {
	Agendas.deleteOne({ _id: req.params.id })
	  .then(() => {
		req.flash("success_msg", "Categoria deletada com sucesso");
		res.redirect("/");
	  })
	  .catch((err) => {
		req.flash("error_msg", "Houve um erro ao deletar a categoria");
		res.redirect("/");
	  });
  });
  
mongoose.connect("mongodb://localhost/agenda")
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => console.log("Could not connect to mongo db " + error));

app.listen(3000, () => {
	  console.log('listening on port 3000!');
});