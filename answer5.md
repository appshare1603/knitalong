Für die technische Grundeinrichtung von **KnitAlong** wählen wir ein modernes, gut skalierbares Fundament. Wir setzen auf **Flutter** (Cross-Platform Mobile), **Supabase** (Open-Source Firebase-Alternative für Datenbank, Auth und Realtime) sowie **LiveKit** (Open-Source WebRTC-Engine mit exzellenter Entwickler-Experience).

---

### 1. Architektur-Übersicht

```text
  [ Flutter App (iOS / Android) ]
         │                │
   WebRTC│                │REST / WebSockets
   Stream│                │(Auth, DB, Chat)
         ▼                ▼
   [ LiveKit Cloud ]   [ Supabase ]
   (Video / Audio)     (PostgreSQL + Realtime)

```

---

### 2. Schritt-für-Schritt Einrichtung

1. **Repository & Projektstruktur aufsetzen:** Strukturierung des Projektes.
Erstelle ein Monorepo oder ein fokussiertes Flutter-Repository.

```bash
# 1. Flutter Projekt erstellen
flutter create --org com.knitalong knitalong_app
cd knitalong_app

# 2. Wichtige Dependencies hinzufügen
flutter pub add supabase_flutter livekit_client flutter_bloc permission_handler flutter_map

```

**Empfohlene Ordnerstruktur (`lib/`):**

```text
lib/
├── core/              # Theme, Utilities, Network-Clients
├── features/
│   ├── auth/          # Login, Registration
│   ├── map/           # Standort-Karte (Mapbox/OSM)
│   ├── profile/       # User-Profil & Einstellungen
│   └── room/          # Live-Video-Raum, Chat & LiveKit-Integration
└── main.dart

```


2. **Supabase Backend konfigurieren:** Authentifizierung & Datenbank.
1. Erstelle ein Projekt auf [Supabase.com](https://supabase.com).
2. Lege die Datenbank-Tabellen über das Supabase Dashboard an:

```sql
-- 1. Profile der Nutzer
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  skills text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Räume (Wohnzimmer)
create table public.rooms (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  host_id uuid references public.profiles(id),
  is_active boolean default true,
  max_participants int default 6,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

```

3. Initialisiere Supabase in `lib/main.dart`:

```dart
await Supabase.initialize(
  url: 'DEINE_SUPABASE_URL',
  anonKey: 'DEIN_SUPABASE_ANON_KEY',
);

```


3. **LiveKit Cloud & Token-Service:** WebRTC-Infrastruktur für Video.
Für sauberes Videostreaming wird ein kurzlebiger Token benötigt, mit dem sich der Client beim Raum anmeldet.

1. Erstelle ein kostenloses Konto bei [LiveKit Cloud](https://livekit.io/).
2. erstelle eine **Edge Function** (z. B. in Supabase), die Tokens ausstellt:

```typescript
// Supabase Edge Function: generate-livekit-token
import { AccessToken } from 'npm:livekit-server-sdk';

Deno.serve(async (req) => {
  const { roomName, participantName } = await req.json();
  
  const at = new AccessToken(
    Deno.env.get('LIVEKIT_API_KEY'),
    Deno.env.get('LIVEKIT_API_SECRET'),
    { identity: participantName }
  );
  
  at.addGrant({ roomJoin: true, room: roomName });
  const token = await at.toJwt();

  return new Response(JSON.stringify({ token }), {
    headers: { "Content-Type": "application/json" }
  });
});

```


4. **LiveKit in Flutter einbinden:** WebRTC Client-Anbindung.
Verbinde die Flutter-App mit dem LiveKit-Server.

```dart
import 'package:livekit_client/livekit_client.dart';

class RoomService {
  Room? _room;

  Future<void> joinRoom(String url, String token) async {
    _room = Room();
    
    // Event-Listener für neue Teilnehmer/Video-Tracks
    _room!.createListener()
      ..on<TrackSubscribedEvent>((event) {
        // Track zur UI hinzufügen (z. B. VideoWidget)
      });

    await _room!.connect(
      url, 
      token,
      fastConnectOptions: FastConnectOptions(
        microphone: TrackOption(enabled: true),
        camera: TrackOption(enabled: true),
      ),
    );
  }

  void disconnect() {
    _room?.disconnect();
  }
}

```


---

### Nächster Schritt

Mit dieser Basis steht das Fundament für Datenbank, Authentifizierung und das Live-Video-Streaming.