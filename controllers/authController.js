const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Login-Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Benutzer in der Datenbank suchen
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Benutzer nicht gefunden' });
    }

    const user = rows[0];

    // 2. Passwort prüfen
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Falsches Passwort' });
    }

    // 3. JWT-Token generieren
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // 4. Token an den Benutzer senden
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Serverfehler' });
  }
};
