const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db'); // Importiere deine DB-Verbindung oder das Modell

// Registrierung
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      console.log('Überprüfe Benutzer:', email);
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      console.log('Gefundene Benutzer:', rows);
  
      if (rows.length > 0) {
        return res.status(400).json({ message: 'Benutzer existiert bereits' });
      }
  
      // Passwort hashen
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      // Neuen Benutzer in die DB einfügen
      await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
  
      res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Interner Serverfehler' });
    }
  });
  

// Login

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      console.log('Login-Versuch für Benutzer:', email);
      const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      console.log('Gefundene Benutzer:', user);
  
      if (user.length === 0) {
        return res.status(404).json({ message: 'Benutzer nicht gefunden' });
      }
  
      const isMatch = bcrypt.compareSync(password, user[0].password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
      }
  
      // JWT erstellen
      const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Benutzer-ID im Response zurückgeben
      res.status(200).json({ token, userId: user[0].id }); // Benutzer-ID hier zurückgeben
    } catch (error) {
      console.error('Fehler bei der Login-Route:', error); // Fehler protokollieren
      res.status(500).json({ message: 'Interner Serverfehler' });
    }
  });


  router.post('/clock-in', (req, res) => {
    const userId = req.body.userId; // Benutzer-ID aus dem Request-Body
    const timestamp = new Date();
  
    console.log('Received User ID:', userId); // Konsolenausgabe
  
    if (!userId) {
      return res.status(400).json({ message: 'Benutzer-ID darf nicht null sein' }); // Fehler, wenn die Benutzer-ID nicht gesetzt ist
    }
  
    const query = 'INSERT INTO clock_ins (user_id, timestamp) VALUES (?, ?)';
    
    db.query(query, [userId, timestamp], (error, results) => {
      if (error) {
        console.error('Fehler beim Einstempeln:', error);
        return res.status(500).json({ message: 'Interner Serverfehler' });
      }
      console.log('Einstempeln erfolgreich:', results); // Konsolenausgabe
      res.status(200).json({ message: 'Einstempeln erfolgreich!' });
    });
  });
  
  
  

module.exports = router;
