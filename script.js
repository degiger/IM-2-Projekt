let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');
let gesamteSongListe = []; // Hier speichern wir die gesamte geladene Songliste

async function holeDaten(url) {
    try {
        let response = await fetch(url);
        if (response.ok) {
            let data = await response.json();
            return data;
        } else {
            throw new Error('Fehler beim Laden der Daten: ' + response.statusText);
        }
    } catch (e) {
        console.error(e);
        anzeige.innerHTML = '<p>Fehler beim Laden der Daten. Bitte überprüfen Sie die Konsole für mehr Informationen.</p>';
        return null;
    }
}

function extractText(value, key) {
    if (typeof value === 'string') {
        return value;
    } else if (value && typeof value === 'object' && value[key]) {
        return value[key];
    } else {
        return 'Unbekannt';
    }
}

function datenDarstellen(songs) {
    anzeige.innerHTML = '';
    if (songs && songs.length > 0) {
        songs.forEach(song => {
            let div = document.createElement('div');
            div.className = 'song';
            let title = extractText(song.title, 'display');
            let artist = extractText(song.artist, 'name');
            let songText = document.createElement('h2');
            songText.innerText = `${title} - ${artist}`;
            div.appendChild(songText);
            anzeige.appendChild(div);
        });
    } else {
        anzeige.innerHTML = '<p>Keine Ergebnisse gefunden</p>';
    }
}

async function init() {
    let songDaten = await holeDaten('https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7?from=2024-04-08T00%3A00%3A00%2B02%3A00&to=2024-04-08T23%3A59%3A00%2B02%3A00&pageSize=500');
    if (songDaten && songDaten.songList) {
        gesamteSongListe = songDaten.songList; // Speichere die Daten in der globalen Variable
        datenDarstellen(gesamteSongListe);
    } else {
        anzeige.innerHTML = '<p>Keine Songs verfügbar oder Datenformat ist unerwartet.</p>';
    }
}

suche.addEventListener('input', function() {
    let ergebnis = suche.value.trim().toLowerCase();
    if (ergebnis.length > 0) {
        let gefilterteSongs = gesamteSongListe.filter(song => {
            let title = extractText(song.title, 'display').toLowerCase();
            let artist = extractText(song.artist, 'name').toLowerCase();
            return title.includes(ergebnis) || artist.includes(ergebnis);
        });
        datenDarstellen(gefilterteSongs);
    } else {
        datenDarstellen(gesamteSongListe);
    }
});

init();
