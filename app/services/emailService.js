var express;
var nodemailer;
var utils;
var jst;
var app;
var emailService;
var user;
var password;
var mailFrom;
var env;
var isInitialised = false;

module.exports = (function () {
    return {
        sendMail: sendMail,
        sendVerificationMail: sendVerificationMail
    }

    function init() {
        if (!isInitialised) {
            express = require('express');
            nodemailer = require('nodemailer');
            utils = require('../utils/utilFactory');
            jst = require('jst');
            app = express();
            emailService = utils.getConfiguration().getProperty('emailService');
            user = utils.getConfiguration().getProperty('user');
            password = utils.getConfiguration().getProperty('password');
            mailFrom = utils.getConfiguration().getProperty('mailFrom');
            env = utils.getConfiguration().getProperty('node.env') || 'development'
            isInitialised = true;
        }
    }


    function sendMail(mailingData) {
        init();
        var mailOptions = {
            envelope: {
                from: mailFrom,
                to: mailingData.sentTo
            },
            subject: mailingData.emailSubject,
            html: mailingData.htmlBody,
        }

        var isWhiteListedMailingEnabled = utils.getConfiguration().getProperty(env)['sendMailToWhiteListed'];
        var whiteListedEmailIds = utils.getConfiguration().getProperty(env)['whiteListedEmailIds'];
        var supportMailId = utils.getConfiguration().getProperty(env)['supportEmailId'];
        var isSupportBccEnabled = utils.getConfiguration().getProperty(env)['isSupportBcc'];
        var emailIDArray = [];
        emailIDArray = whiteListedEmailIds.split(',');

        if (isWhiteListedMailingEnabled) {
            var mailSent = false;
            emailIDArray.forEach(function (emailId) {
                if (mailingData.sentTo === emailId) {
                    sendingMail(mailOptions);
                    mailSent = true;
                }
            });
        }
        else {
            sendingMail(mailOptions);
        }

        if (isSupportBccEnabled) {
           // var mailOptionBCC = JSON.parse(JSON.stringify(mailOptions));
         //   mailOptionBCC.envelope.to = supportMailId;
          //  sendingMail(mailOptionBCC);
        }
    }

    function sendingMail(mailOptions) {

        var smtpTransport = nodemailer.createTransport("SMTP", {
            service: emailService,
            auth: {
                user: user,
                pass: password
            }
        });

        smtpTransport.sendMail(mailOptions, function (err, msgInfo) {
            var result = {};
            if (err) {
                result.err = 'mail not sent, some error occured!';
                result.isMailSent = false;
            } else {
                result.isMailSent = true;
            }
            return result;
        });
    }

    function sendVerificationMail(client) {
        init();
        var subject = utils.getTemplate().getProperty('signUpMailTemplate')['subject'];
        var bodyTemplate = utils.getTemplate().getProperty('signUpMailTemplate')['body']
        client.serverUrl = utils.getUtils().getServerUrl(client);

        var emailContent = jst.render(bodyTemplate, client);

        var mailContent = {
            sentTo: client.primaryEmailId,
            htmlBody: emailContent,
            emailSubject: subject
        }
        sendMail(mailContent);
        return Promise.resolve(client);
    }
}());


