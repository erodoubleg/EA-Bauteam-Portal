import 'package:flutter/material.dart';
import 'clock_in_page.dart'; // Stelle sicher, dass der Pfad korrekt ist


class MainPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Hauptseite'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () {
              // Hier kannst du Logout-Funktionalität implementieren
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
            onPressed: () {
                Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ClockInPage()),
                );
            },
            child: Text('Einstempeln'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Navigiere zur Dokumente hochladen-Seite
              },
              child: Text('Dokumente hochladen'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Navigiere zur Krankmeldungen-Seite
              },
              child: Text('Krankmeldungen'),
            ),
          ],
        ),
      ),
    );
  }
}
