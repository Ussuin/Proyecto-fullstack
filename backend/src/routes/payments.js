const express = require('express');
const mercadopago = require('mercadopago');
require('dotenv').config();

const router = express.Router();

const mpClient = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const preferenceClient = new mercadopago.Preference(mpClient);

router.post('/pago', async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: 'Mensualidad',
          unit_price: 500,
          quantity: 1
        }
      ],
      back_urls: {
        success: 'https://www.google.com/',
        failure: 'https://www.google.com/',
        pending: 'https://www.google.com/'
      },
      auto_return: 'approved'
    };

    const response = await preferenceClient.create({ body: preference });
    res.json({ init_point: response.init_point });
  } catch (error) {
  console.error('Error creando pago:', error);
  res.status(500).json({ error: error.message, details: error });
}

  
});

module.exports = router;
