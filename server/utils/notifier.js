require('dotenv').config();

/**
 * Sends SMS and WhatsApp notifications to users and administrators.
 * If Twilio API credentials are set, it makes active network requests.
 * Otherwise, it logs a simulated alert to the console.
 * 
 * @param {Object} params
 * @param {string} params.to - Recipient phone number (with country code e.g. +919855598544)
 * @param {string} params.message - Content of the message
 * @param {Array<string>} params.channels - Channels to send ('sms', 'whatsapp')
 */
const sendNotification = async ({ to, message, channels = ['sms', 'whatsapp'] }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromSms = process.env.TWILIO_PHONE_NUMBER;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER;

  const hasTwilio = accountSid && authToken;

  // Ensure phone numbers have the "+" prefix for international format
  let formattedTo = to.trim();
  if (!formattedTo.startsWith('+')) {
    formattedTo = `+${formattedTo}`;
  }

  for (const channel of channels) {
    if (channel === 'sms') {
      if (hasTwilio && fromSms) {
        try {
          const authTokenBase64 = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
          const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authTokenBase64}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              From: fromSms,
              To: formattedTo,
              Body: message
            })
          });
          if (!res.ok) {
            console.error("❌ Twilio SMS Error Details:", await res.text());
          } else {
            console.log(`✅ [SMS Sent] Notification delivered to ${formattedTo}`);
          }
        } catch (err) {
          console.error("❌ Twilio SMS Fetch Exception:", err);
        }
      } else {
        console.log(`\n--- 📱 [SIMULATED SMS ALERT] ---`);
        console.log(`Recipient: ${formattedTo}`);
        console.log(`Content  : ${message}`);
        console.log(`--------------------------------\n`);
      }
    }

    if (channel === 'whatsapp') {
      // Twilio WhatsApp formatting: recipient must be prefixed with "whatsapp:"
      const whatsappTo = formattedTo.startsWith('whatsapp:') ? formattedTo : `whatsapp:${formattedTo}`;
      const whatsappFrom = fromWhatsApp ? (fromWhatsApp.startsWith('whatsapp:') ? fromWhatsApp : `whatsapp:${fromWhatsApp}`) : null;

      if (hasTwilio && whatsappFrom) {
        try {
          const authTokenBase64 = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
          const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authTokenBase64}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              From: whatsappFrom,
              To: whatsappTo,
              Body: message
            })
          });
          if (!res.ok) {
            console.error("❌ Twilio WhatsApp Error Details:", await res.text());
          } else {
            console.log(`✅ [WhatsApp Sent] Notification delivered to ${formattedTo}`);
          }
        } catch (err) {
          console.error("❌ Twilio WhatsApp Fetch Exception:", err);
        }
      } else {
        console.log(`\n--- 💬 [SIMULATED WHATSAPP ALERT] ---`);
        console.log(`Recipient: ${whatsappTo}`);
        console.log(`Content  : ${message}`);
        console.log(`------------------------------------\n`);
      }
    }
  }
};

module.exports = { sendNotification };
