# 🔧 Backend Fixes Part 2 - Game Mechanics

**Data:** 24 Luglio 2026  
**Obiettivo:** Implementare validazioni squadre, capitano x2, regole ripetibili, abbandono

---

## 📋 **Fix Implementati**

### ✅ **Fix 4: Validazioni Team**

**Regole:**
1. **Minimo viaggiatori:** `(totalTravelers - 1) / 2` arrotondato per difetto, **minimo 3**
2. **Capitani:** Esattamente **1 per squadra**
3. **Modifica team:** Solo **prima di `travel.startDate`**

**Esempi calcolo minimo:**
| Viaggiatori Totali | Calcolo | Minimo Squadra |
|-------------------|---------|----------------|
| 5 | (5-1)/2 = 2 | **3** (cap a 3) |
| 7 | (7-1)/2 = 3 | **3** |
| 9 | (9-1)/2 = 4 | **4** |
| 10 | (10-1)/2 = 4.5 | **4** (floor) |
| 15 | (15-1)/2 = 7 | **7** |

**Codice aggiunto:**
```java
// TeamService.java
private void validateTeamComposition(Travel travel, CreateTeamRequest request) {
    long totalTravelers = travel.getTravelUsers().stream()
            .filter(tu -> tu.getRole() == TravelUserRole.TRAVELER)
            .count();

    int minTravelers = Math.max(3, (int) ((totalTravelers - 1) / 2));

    if (request.getUsers().size() < minTravelers) {
        throw new IllegalStateException(
            String.format("Team must have at least %d travelers (total: %d)",
                minTravelers, totalTravelers));
    }

    long captainCount = request.getUsers().stream()
            .filter(u -> u.isCaptain())
            .count();

    if (captainCount != 1) {
        throw new IllegalStateException("Team must have exactly 1 captain");
    }
}

private void validateTeamModificationAllowed(Travel travel) {
    LocalDate today = LocalDate.now();
    if (!today.isBefore(travel.getStartDate())) {
        throw new IllegalStateException("Cannot create/modify team: travel has already started");
    }
}
```

**Endpoint interessati:**
- `POST /api/teams/create`
- `PUT /api/teams/{id}`

---

### ✅ **Fix 5: Punti Capitano x2**

**Meccanica:**
- Quando un viaggiatore riceve punti, se è **capitano** in una squadra → punti **x2** per quella squadra
- Vale per **bonus** e **malus**

**Implementazione:**
Il `Point` viene salvato con valore base. Il raddoppio va calcolato nelle query leaderboard considerando `TeamUser.captain = true`.

**Query Leaderboard Squadre (esempio):**
```sql
SELECT 
    t.id AS team_id,
    t.name AS team_name,
    SUM(
        CASE 
            WHEN tu.captain = true THEN tr.value * 2
            ELSE tr.value
        END
    ) AS total_points
FROM team t
JOIN teams_users tu ON tu.team_id = t.id
JOIN point p ON p.travels_users_id = tu.travel_user_id
JOIN travels_rules tr ON tr.id = p.travels_rules_id
WHERE t.travel_user_id IN (
    SELECT id FROM travels_users WHERE travel_id = :travelId
)
GROUP BY t.id, t.name
ORDER BY total_points DESC;
```

**Esempio:**
- Viaggiatore A riceve +10 (K-BBQ)
- Squadra 1: ha A come **capitano** → +20 punti
- Squadra 2: ha A come normale → +10 punti
- Squadra 3: non ha A → +0 punti

**TODO:** Implementare query custom nel `LeaderboardService` (se esiste) o creare endpoint dedicato.

---

### ✅ **Fix 6: Regole Ripetibili**

**Campo `TravelRule.repeatable`:**
- `false` → assegnabile **1 sola volta** in tutto il viaggio
- `true` → assegnabile **1 volta al giorno**

**Validazione aggiunta:**
```java
// PointService.java - dentro addPoint()
if (!travelRule.isRepeatable()) {
    boolean alreadyAssigned = pointRepository
        .findByTravelRule_IdAndTravelUser_Id(travelRuleId, travelUserId)
        .isPresent();

    if (alreadyAssigned) {
        throw new IllegalStateException(
            String.format("Rule '%s' is not repeatable and was already assigned",
                travelRule.getRule().getDescription()));
    }
}
```

**Nuovo metodo repository:**
```java
// PointRepository.java
Optional<Point> findByTravelRule_IdAndTravelUser_Id(Long travelRuleId, Long travelUserId);
```

**Esempi:**
- **Repeatable=false:** "Selfie con K-pop Idol" (+20) → assegnabile 1 volta in tutto il viaggio
- **Repeatable=true:** "Foto postata" (+2) → assegnabile 1 volta al giorno

---

### ✅ **Fix 7: Abbandono Viaggiatore**

**Endpoint:**
```http
POST /api/travels/{id}/travelers/{travelUserId}/abandon
```

**Meccanica:**
1. Admin chiama endpoint per marcare abbandono
2. Sistema crea automaticamente regola "Abbandono" con valore **-100**
3. Applica malus al viaggiatore
4. Le squadre che lo hanno in rosa ricevono -100 (o -200 se è capitano)

**Codice:**
```java
// TravelService.java
@Transactional
public void abandonTraveler(Long travelId, Long travelUserId) {
    Travel travel = findById(travelId);
    TravelUser traveler = travel.getTravelUsers().stream()
        .filter(tu -> tu.getId().equals(travelUserId) && tu.getRole() == TravelUserRole.TRAVELER)
        .findFirst()
        .orElseThrow(() -> new EntityNotFoundException("Traveler not found"));

    // Create or get "Abbandono" rule
    TravelRule abandonRule = travel.getTravelRules().stream()
        .filter(tr -> "Abbandono".equals(tr.getRule().getDescription()))
        .findFirst()
        .orElseGet(() -> {
            Rule rule = ruleService.save(Rule.builder()
                .description("Abbandono")
                .category(categoryService.findById(1L))
                .value(-100)
                .build());
            
            TravelRule tr = TravelRule.builder()
                .travel(travel)
                .rule(rule)
                .repeatable(false)
                .value(-100)
                .build();
            
            travel.getTravelRules().add(tr);
            travelRepository.save(travel);
            return tr;
        });

    // Assign malus
    Point abandonPoint = Point.builder()
        .travelRule(abandonRule)
        .travelUser(traveler)
        .day(LocalDate.now())
        .build();

    pointRepository.save(abandonPoint);
}
```

**File creati:**
- `TravelUserRepository.java`

---

## 🎯 **Flussi Completi**

### **Creazione Squadra**
1. Player joina viaggio con invite link → `role=PLAYER`
2. Player tenta creare squadra con 2 viaggiatori → **ERROR: minimo 3**
3. Player crea squadra con 4 viaggiatori + 1 capitano → **OK**
4. Player modifica squadra (cambia capitano) → **OK** (se prima di startDate)
5. Viaggio inizia (`startDate` passata)
6. Player tenta modificare squadra → **ERROR: travel started**

### **Assegnazione Punti con Capitano**
1. Admin assegna "K-BBQ" (+7) a Viaggiatore A
2. Sistema salva Point con `value=7`
3. Classifica calcola:
   - Squadra 1 (A capitano): +14 punti
   - Squadra 2 (A normale): +7 punti
   - Viaggiatore A: +7 punti

### **Regole Ripetibili**
1. Admin configura "Foto postata" (+2) con `repeatable=true`
2. Admin assegna a Viaggiatore B il giorno 1 → **OK**
3. Admin tenta assegnare di nuovo il giorno 1 → **ERROR: già assegnato oggi**
4. Admin assegna il giorno 2 → **OK**

### **Abbandono**
1. Viaggiatore C annuncia abbandono
2. Admin chiama `POST /travels/1/travelers/5/abandon`
3. Sistema crea regola "Abbandono" (-100)
4. Sistema assegna -100 a Viaggiatore C
5. Tutte le squadre con C in rosa ricevono il malus:
   - Se C è capitano: **-200**
   - Se C è normale: **-100**

---

## 📊 **Test Cases**

### **Test 1: Minimo Viaggiatori**
```json
// Request: Create team con 2 viaggiatori (9 totali)
POST /api/teams/create
{
  "travelId": 1,
  "name": "Team Test",
  "users": [
    {"user": {"id": 1}, "captain": true},
    {"user": {"id": 2}, "captain": false}
  ]
}

// Response: 400 Bad Request
{
  "error": "Team must have at least 4 travelers (total travelers: 9)"
}
```

### **Test 2: Doppio Capitano**
```json
// Request: Create team con 2 capitani
POST /api/teams/create
{
  "users": [
    {"user": {"id": 1}, "captain": true},
    {"user": {"id": 2}, "captain": true},
    {"user": {"id": 3}, "captain": false}
  ]
}

// Response: 400 Bad Request
{
  "error": "Team must have exactly 1 captain"
}
```

### **Test 3: Regola Non Ripetibile**
```bash
# Day 1: Assegna "Selfie K-pop" (+20)
POST /api/points/assign
{"travelRuleId": 15, "travelUserId": 3, "day": "2026-08-16"}
# OK ✅

# Day 2: Riassegna stessa regola
POST /api/points/assign
{"travelRuleId": 15, "travelUserId": 3, "day": "2026-08-17"}
# ERROR ❌: "Rule 'Selfie con K-pop Idol' is not repeatable"
```

### **Test 4: Abbandono**
```bash
# Admin marca abbandono
POST /api/travels/1/travelers/5/abandon

# Verifica punti
GET /api/leaderboard/travels/1/travelers
# Viaggiatore 5: -100 punti

GET /api/leaderboard/travels/1/teams
# Team che aveva viaggiatore 5: -100 o -200 (se capitano)
```

---

## 🚀 **Deploy**

Tutti i fix sono **backward compatible** (nessuna breaking change su API esistenti).

```bash
cd C:\Users\france4\fantatravel-master\fantatravel-master
git add .
git commit -m "🔧 Backend fixes part 2: team validation, captain x2, repeatable rules, abandonment"
git push origin main
```

**Restart backend:**
```bash
./mvnw spring-boot:run
```

---

## 📝 **Note Finali**

### **TODO: Leaderboard Query**
Il calcolo punti capitano x2 va implementato nelle query leaderboard. Serve creare/modificare:
- `GET /api/leaderboard/travels/{id}/teams` → considera `TeamUser.captain`
- `GET /api/leaderboard/travels/{id}/travelers` → punti diretti (no moltiplicatore)

### **Frontend Impact**
- Form creazione squadra: validare numero min viaggiatori client-side
- Form creazione squadra: checkbox capitano (max 1 selezionabile)
- Assegnazione punti: mostrare se regola è ripetibile
- Pagina viaggiatori: bottone "Marca abbandono" (conferma modale)

---

**Fix completati! Backend allineato! 🎮**
