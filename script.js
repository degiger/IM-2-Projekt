let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');
let karussellButton = document.querySelector('#karussell');
let gesamteSongListe = [];
let aktuelleAnzeigeListe = []; // Hält die Liste der aktuell angezeigten Songs

async function holeDaten(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Daten');
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        anzeige.innerHTML = '<p>Sorry, keine Songs/ Künstler:in gefunden – try again!</p>';
        return null; // Gibt null zurück, um anzuzeigen, dass ein Fehler aufgetreten ist
    }
}

function datenDarstellen(songs) {
    anzeige.innerHTML = '';
    if (songs.length === 0) {
        anzeige.innerHTML = '<p>Sorry, keine Songs/ Künstler:in gefunden – try again!</p>';
        return;
    }
    songs.forEach(song => {
        let div = document.createElement('div');
        div.className = 'song';
        div.onclick = () => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist.name)}`);
        let songText = document.createElement('h2');
        songText.innerText = song.title;
        let artistText = document.createElement('p');
        artistText.innerText = song.artist.name;
        div.appendChild(songText);
        div.appendChild(artistText);
        anzeige.appendChild(div);
    });
}

function zufaelligeSongsAnzeigen() {
    let anzahlSongs = window.innerWidth > 768 ? 4 : 2; // Anzahl der Songs basierend auf der Bildschirmbreite
    let zufaelligeSongs = aktuelleAnzeigeListe.sort(() => 0.5 - Math.random()).slice(0, anzahlSongs);
    datenDarstellen(zufaelligeSongs);
}

async function init() {
    let songDaten = await holeDaten('https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7?from=2024-04-08T00%3A00%3A00%2B02%3A00&to=2024-04-08T23%3A59%3A00%2B02%3A00&pageSize=500');
    if (songDaten && songDaten.songList) {
        gesamteSongListe = songDaten.songList;
        aktuelleAnzeigeListe = gesamteSongListe.slice(); // Kopiere die gesamte Liste zum Start
        zufaelligeSongsAnzeigen();
    } else {
        anzeige.innerHTML = '<p>Sorry, keine Songs/ Künstler:in gefunden – try again!</p>';
    }
}

suche.addEventListener('input', function() {
    let ergebnis = suche.value.trim().toLowerCase();
    aktuelleAnzeigeListe = gesamteSongListe.filter(song => song.title.toLowerCase().includes(ergebnis) || song.artist.name.toLowerCase().includes(ergebnis));
    datenDarstellen(aktuelleAnzeigeListe);
});

karussellButton.addEventListener('click', zufaelligeSongsAnzeigen);

init();
