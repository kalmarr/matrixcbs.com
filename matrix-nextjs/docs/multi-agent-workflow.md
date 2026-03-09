# Többügynökös fejlesztési workflow (TMUX)

Komplex feladatoknál MINDIG használj több párhuzamos Claude Code ügynököt TMUX session-ökben.

## Mikor használj több ügynököt?

- Bármilyen fejlesztési feladat ami több fájlt vagy modult érint
- Feature fejlesztés + teszt írás párhuzamosan
- Frontend + backend munka egyszerre
- Refaktorálás + biztonsági ellenőrzés párhuzamosan
- Kommentelés + kód módosítás külön ügynökben
- Nagy feature / új modul fejlesztése

## TMUX alapparancsok

```bash
# Új session indítása
tmux new-session -s projekt-neve

# Panelek létrehozása
Ctrl+b %     — vertikális split (bal/jobb)
Ctrl+b "     — horizontális split (fent/lent)
Ctrl+b o     — panel váltás
Ctrl+b z     — panel zoom (teljes képernyő / vissza)
Ctrl+b x     — panel bezárás
Ctrl+b d     — session lecsatolás (háttérben fut tovább)

# Session-höz visszacsatolás
tmux attach -t projekt-neve

# Session-ök listázása
tmux ls
```

## Ajánlott ügynök felosztások

### 2 ügynök (alapértelmezett — minden feladatnál)

| Panel | Szerep | Feladat |
|-------|--------|---------|
| 1 | **Fejlesztő** | Feature implementáció, kód írás, módosítás |
| 2 | **Reviewer** | Tesztek, biztonsági ellenőrzés, kommentelés |

Használd ezt: egyszerű feature, bugfix, refaktorálás

### 3 ügynök (közepes komplexitás)

| Panel | Szerep | Feladat |
|-------|--------|---------|
| 1 | **Backend** | Controller, Service, Model, Migration |
| 2 | **Frontend** | Blade, Livewire, Alpine.js, CSS |
| 3 | **QA** | Tesztek, biztonsági audit, komment ellenőrzés |

Használd ezt: teljes feature ami backend + frontend munkát igényel

### 4+ ügynök (nagy feature / refaktorálás)

| Panel | Szerep | Feladat |
|-------|--------|---------|
| 1 | **Architekt** | Tervezés, Service struktúra, interface-ek |
| 2 | **Backend** | Üzleti logika implementáció |
| 3 | **Frontend** | UI, UX implementáció |
| 4 | **QA + DevOps** | Tesztek, biztonsági audit, deployment ellenőrzés |

Használd ezt: új modul, nagy átszervezés, teljes feature csomag

## Ügynökök közötti koordináció

### Alapszabályok
- Minden ügynök UGYANAZT a CLAUDE.md-t olvassa — konzisztencia garantált
- Az ügynökök NE módosítsák ugyanazt a fájlt egyszerre — **fájl-szintű felosztás**
- Ha egy ügynök olyan fájlt kell módosítson amit másik is használ, ELŐBB commitoljon a másik
- Git branch-enként dolgozzanak ha lehetséges, utána merge

### Végrehajtási sorrend
1. **Architekt/Fejlesztő** ügynök ELŐSZÖR — létrehozza az alapstruktúrát
2. **Backend/Frontend** ügynökök PÁRHUZAMOSAN — implementáció
3. **Reviewer/QA** ügynök UTOLJÁRA — ellenőrzi a többiek munkáját

### Fájl felosztás példa (Laravel feature)
```
Fejlesztő ügynök:          Reviewer ügynök:
├── app/Services/           ├── tests/Feature/
├── app/Models/             ├── tests/Unit/
├── app/Http/Controllers/   └── biztonsági ellenőrzés
├── database/migrations/
└── app/Http/Requests/

Frontend ügynök:            QA ügynök:
├── resources/views/        ├── komment ellenőrzés
├── resources/css/          ├── kód review
└── resources/js/           └── docs frissítés
```

## Indítási sablonok

### 2 ügynök (gyors)
```bash
tmux new-session -s myproject -d
tmux send-keys -t myproject 'cd /projekt/path && claude' Enter
tmux split-window -h -t myproject
tmux send-keys -t myproject 'cd /projekt/path && claude' Enter
tmux attach -t myproject
```

### 3 ügynök
```bash
tmux new-session -s myproject -d
tmux send-keys -t myproject 'cd /projekt/path && claude' Enter
tmux split-window -h -t myproject
tmux send-keys -t myproject 'cd /projekt/path && claude' Enter
tmux split-window -v -t myproject
tmux send-keys -t myproject 'cd /projekt/path && claude' Enter
tmux attach -t myproject
```

### 4 ügynök
```bash
tmux new-session -s myproject -d
tmux send-keys -t myproject 'cd /projekt/path && claude' Enter
tmux split-window -h -t myproject
tmux send-keys -t myproject 'cd /projekt/path && claude' Enter
tmux select-pane -t 0
tmux split-window -v -t myproject
tmux send-keys -t myproject 'cd /projekt/path && claude' Enter
tmux select-pane -t 2
tmux split-window -v -t myproject
tmux send-keys -t myproject 'cd /projekt/path && claude' Enter
tmux attach -t myproject
```

### Bash script (automatikus indítás)
```bash
#!/bin/bash
# start-agents.sh — Többügynökös fejlesztés indítása
# Használat: ./start-agents.sh [projekt-path] [ügynökök-száma]

PROJECT_PATH="${1:-.}"
AGENTS="${2:-2}"
SESSION="dev-$(basename $PROJECT_PATH)"

tmux new-session -s "$SESSION" -d
tmux send-keys -t "$SESSION" "cd $PROJECT_PATH && claude" Enter

for ((i=2; i<=AGENTS; i++)); do
    if ((i % 2 == 0)); then
        tmux split-window -h -t "$SESSION"
    else
        tmux split-window -v -t "$SESSION"
    fi
    tmux send-keys -t "$SESSION" "cd $PROJECT_PATH && claude" Enter
done

tmux select-layout -t "$SESSION" tiled
tmux attach -t "$SESSION"
```

Mentsd el: `~/bin/start-agents.sh` és `chmod +x ~/bin/start-agents.sh`

Használat:
```bash
start-agents.sh ~/projects/dentallas.hu 3
```
