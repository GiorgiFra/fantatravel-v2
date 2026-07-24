# 🌍 Fantatravel - Preview Demo Interfaccia

## 🎨 Anteprima Interfaccia Migliorata

Questo progetto contiene un'**anteprima HTML standalone** della nuova interfaccia ridisegnata per Fantatravel.

### 📱 Come visualizzare

**Locale:**
Apri il file `preview-demo.html` nel browser

**Online (GitHub Pages):**
1. Vai su **Settings** del repository
2. Sezione **Pages**
3. Source: **Deploy from branch** → `main` → `/root`
4. Salva
5. Il link sarà: `https://[username].github.io/[repo-name]/preview-demo.html`

---

## ✨ Cosa include la preview

### 🏠 **8 Pagine Complete:**

1. **Home Dashboard** - Statistiche viaggi, squadre, punti totali
2. **Viaggi** - Lista viaggi con card moderne, badge ruoli, stati
3. **Crea Viaggio** - Form completo con tutte le destinazioni
4. **Configura Bonus/Malus** - Gestione regole per categoria
5. **Categorie Special** - 10 premi divertenti selezionabili
6. **Punti** - Toggle Admin/Player per assegnare punti o vedere la squadra
7. **Classifica Live** - Podio 3D animato con top 3
8. **Profilo** - Stats personali, achievement, impostazioni

### 🎨 **Tema Travel-Themed:**
- 🌅 **Sunset Orange** (#FF6B35) - Primary
- 🌊 **Ocean Blue** (#00A8E8) - Secondary
- 🏆 **Golden Yellow** (#FFC107) - Warning/Awards
- Glassmorphism effects
- Animazioni smooth
- Hover effects 3D

### 📱 **Mobile Responsive:**
- Bottom navigation bar
- Touch-friendly
- PWA-ready design

---

## 🗺️ **Nuove Destinazioni Aggiunte**

Oltre alla Cina, ora ci sono **10 destinazioni**:
- 🇰🇷 Corea del Sud - K-pop, K-BBQ e K-culture
- 🗾 Giappone - Tra tradizione e tecnologia
- 🗼 Francia - La ville lumière
- 🗽 New York - La Grande Mela
- 🏛️ Roma - La città eterna
- 🛕 Thailandia - Templi e spiagge
- 🎨 Barcellona - Gaudí e tapas
- 🐫 Egitto - Piramidi e faraoni
- 🦘 Australia - Outback e reef
- 🎭 Rio de Janeiro - Samba e Cristo

### 🇰🇷 **Regole Corea del Sud** (20 nuove regole)
File: `src/main/resources/db/changelog/DML/51.insert_south_korea_rules.yml`

**BONUS:**
- Assaggia kimchi (+5)
- K-BBQ senza bruciarsi (+7)
- Bottiglia di soju (+10)
- Polpo vivo (+15)
- Selfie con K-pop idol (+20)
- Indossa hanbok (+10)
- Karaoke noraebang (+7)
- Sauna jjimjilbang (+12)

**MALUS:**
- Brucia bocca al BBQ (-5)
- Rifiuta kimchi (-10)
- Non regge piccante (-7)
- Si perde a Seoul (-5)
- Overspend skincare (-8)

---

## 📦 **File Modificati nel Progetto**

### **Database (Liquibase):**
```
src/main/resources/db/changelog/
├── DML/50.insert_new_destinations.yml (10 nuove destinazioni)
├── DML/51.insert_south_korea_rules.yml (20 regole coreane)
└── changelog-master.yml (aggiornato)
```

### **Frontend (React):**
```
src/main/web/fantatravel-app/src/
├── app/theme/theme.ts (tema travel-themed)
├── app/component/home/Home.tsx (dashboard migliorata)
├── app/component/travels/Travels.tsx (card modernizzate)
├── locales/it/translation.json (traduzioni IT)
└── locales/en/translation.json (traduzioni EN)
```

### **Preview:**
```
preview-demo.html (anteprima standalone completa)
```

---

## 🚀 **Setup Progetto Completo**

### **Backend (Spring Boot):**
```bash
cd fantatravel-master
mvn clean install
mvn spring-boot:run
```

### **Frontend (React):**
```bash
cd src/main/web/fantatravel-app
npm install
npm start
```

---

## 🎯 **Prossimi Passi**

- [ ] Deploy preview su GitHub Pages
- [ ] Integrare tema nel progetto React
- [ ] Test responsiveness
- [ ] Aggiungere animazioni avanzate
- [ ] PWA manifest e service worker
- [ ] Dark/Light mode toggle

---

## 📸 **Screenshots**

Apri `preview-demo.html` per vedere:
- 🏠 Dashboard con stats
- ✈️ Card viaggi con badge
- ⚙️ Configuratore regole
- ⭐ Categorie Special
- 🏆 Podio animato
- 👤 Profilo con achievement

---

## 🤝 **Contributi**

Questo è un prototipo UI/UX per Fantatravel.
Per feedback o suggerimenti, apri una Issue!

---

## 📄 **Licenza**

Proprietà di Alpitour World - Fantatravel Team

---

**Buon viaggio! 🌍✈️**
