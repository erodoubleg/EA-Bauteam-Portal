import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class ClockInPage extends StatefulWidget {
  @override
  _ClockInPageState createState() => _ClockInPageState();
}

class _ClockInPageState extends State<ClockInPage> {
  bool isLoading = false;
  String message = '';

Future<void> clockIn() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  int? userId = prefs.getInt('userId'); // Benutzer-ID abrufen

  if (userId == null) {
    print('Benutzer-ID ist nicht gesetzt!');
    return; // Fehlerbehandlung, wenn die Benutzer-ID nicht vorhanden ist
  }

  final url = Uri.parse('http://localhost:3000/api/clock-in');
  try {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'userId': userId, // Benutzer-ID an den Server senden
      }),
    );

    if (response.statusCode == 200) {
      print('Einstempeln erfolgreich: ${response.body}');
    } else {
      print('Fehler beim Einstempeln: ${response.body}');
    }
  } catch (error) {
    print('Verbindung zum Server fehlgeschlagen: $error');
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Einstempeln'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (message.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 20.0),
                child: Text(
                  message,
                  style: TextStyle(color: Colors.green),
                ),
              ),
            isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: clockIn,
                    child: Text('Einstempeln'),
                  ),
          ],
        ),
      ),
    );
  }
}
