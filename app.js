const express = require('express');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS-Paket importieren
require('dotenv').config();


const app = express();

// CORS Middleware aktivieren
app.use(cors()); // Erlaubt alle Ursprünge

// Body Parser Middleware
app.use(bodyParser.json());

// Routen
app.use('/api', authRoutes);

// Start des Servers
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
