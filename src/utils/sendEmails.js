const FormData = require("form-data");
const Mailgun = require("mailgun.js");
const { tryQuery } = require("../helper/error");

require("dotenv").config()

const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
  username: process.env.MY_MAIGUN_USERNAME,
  key: process.env.MAILGUN_API_KEY,
  url: process.env.MAILGUN_URL
});

async function sendCode(email, code, subject) {

    const subjectsWords = ["email", "senha"]
    const words = ["de seu e-mail", "de sua senha"]
    let emailSubject = ""
    let word = ""

    if(subject == "email") {
        emailSubject = subjectsWords[0]
        word = words[0]
    } else if(subject == "password") {
        emailSubject = subjectsWords[1]
        word = words[1]
    } else {
        throw new Error("Assunto não definido!!");
    }

    const htmlEmail = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            color: #1a73e8;
            margin: 20px 0;
        }
        .footer {
            font-size: 12px;
            color: #666666;
            margin-top: 30px;
            text-align: center;
        }
        </style>
    </head>
    <body>
        <div class="container">
        <h2>Recuperação de ${emailSubject}</h2>
        <p>Olá,</p>
        <p>Você solicitou a recuperação ${word}. Use o código abaixo para continuar com o processo:</p>
        <div class="code">${code}</div>
        <p>Este código é válido por <strong>1 minutos</strong>. Se você não solicitou essa recuperação, ignore este e-mail.</p>
        <div class="footer">
            © 2025 Syntech LTDA. Todos os direitos reservados.
        </div>
        </div>
    </body>
    </html>
    `;

    const data = await tryQuery("Erro ao enviar o e-mail...", () => mg.messages.create(process.env.MY_DOMAIN, {
      from: `Suporte Syntech <${process.env.MY_ADDRESS_MAILGUN}>`,
      to: [`Security Sustentabilidade Social <${email}>`],
      subject: `SUSTENTABILIDADE SOCIAL - Redefinição de ${emailSubject} solicitada`,
      html: htmlEmail
    }));

    return data;
}

module.exports = sendCode;