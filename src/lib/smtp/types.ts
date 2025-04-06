import SMTPTransport from 'nodemailer/lib/smtp-transport'

export type NodemailerParams = {
  transporter: SMTPTransport | SMTPTransport.Options
  defaults?: SMTPTransport.Options
}
