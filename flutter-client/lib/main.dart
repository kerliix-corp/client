import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

void main() {
  runApp(KerliixApp());
}

class KerliixApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kerliix OAuth Demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: LoginPage(),
    );
  }
}

class LoginPage extends StatelessWidget {
  // Replace with your app credentials
  final String clientId = "df0a1e8ad5b5a3f6c9ebfa97a234be86";
  final String redirectUri = "myapp://callback";
  final String authServer = "http://localhost:4000"; // or your deployed auth server

  Future<void> login(BuildContext context) async {
    final url =
        "$authServer/oauth/authorize?client_id=$clientId&redirect_uri=$redirectUri&response_type=code&scope=openid profile email&state=test123";

    // Launch browser for login
    final result = await FlutterWebAuth.authenticate(
        url: url, callbackUrlScheme: "myapp");

    // Extract code from callback URL
    final code = Uri.parse(result).queryParameters['code'];

    if (code == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Authorization code not received")),
      );
      return;
    }

    // Exchange code for token via backend
    final tokenResp = await http.post(
      Uri.parse("$authServer/oauth/token"),
      body: {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUri,
      },
      headers: {
        'Authorization':
            'Basic ' + base64Encode(utf8.encode('$clientId:YOUR_CLIENT_SECRET')),
      },
    );

    if (tokenResp.statusCode != 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error exchanging code: ${tokenResp.body}")),
      );
      return;
    }

    final tokens = jsonDecode(tokenResp.body);
    Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => DashboardPage(tokens: tokens)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Kerliix OAuth Login")),
      body: Center(
        child: ElevatedButton(
          onPressed: () => login(context),
          child: Text("Login with Kerliix"),
        ),
      ),
    );
  }
}

class DashboardPage extends StatelessWidget {
  final Map<String, dynamic> tokens;

  DashboardPage({required this.tokens});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Dashboard")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text("Tokens:", style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Expanded(
                child: SingleChildScrollView(
                    child: Text(jsonEncode(tokens),
                        style: TextStyle(fontFamily: 'monospace')))),
          ],
        ),
      ),
    );
  }
}
