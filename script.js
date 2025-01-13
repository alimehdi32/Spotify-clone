let currentsong = new Audio()
let songs = []
let songinfo = ""
let currFolder
let cardContainer = document.querySelector(".cardContainer")
async function getsongs(folder) {
    currFolder = folder
    let a = await fetch(`/${currFolder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < as.length; i++) {
        if (as[i].href.includes(".mp3")) {
            songs.push(as[i].href.split(`/${folder}/`)[1]
            )
        }
    }
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" width="34" src="images/music.svg" alt=""> 
        <div class="info"> 
        <div> ${song.replaceAll("%20", " ")}</div> 
        <div>Harry</div> 
        </div> 
        <div class="playnow"> 
        <div>Play Now</div> 
        <img class="invert" src="images/play.svg" alt=""> 
        </div> </li>`
    } //Attach an event Listener to each song 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", (element) => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    console.log("done 2")
    console.log(songs)
    return songs
}
function playNextSong() {
    console.log(currentsong.src.split("/").pop())
    let currentSongIndex = songs.indexOf(currentsong.src.split("/").pop());
    if (currentSongIndex == songs.length - 1) {
        currentSongIndex = 0; // Loop back to the first song 
    } else {
        currentSongIndex += 1;
    }
    playMusic(songs[currentSongIndex]);
}
function playPreviousSong() {
    let currentSongIndex = songs.indexOf(currentsong.src.split('/').pop());
    if (currentSongIndex == 0) {
        currentSongIndex = songs.length - 1; // Loop to the last song 
    } else {
        currentSongIndex -= 1;
    }
    playMusic(songs[currentSongIndex]);
}
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
let playMusic = (track, pause = false) => {
    let audio = new Audio("/Song/" + track)
    currentsong.src = `/${currFolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "images/pause.svg"
    }
    //let songinfo = track.split(".mp3")[0].split("-").slice(0,track.split(".mp3")[0].split("-").length-1).join(" ") 
    songinfo = track.replaceAll("%20", " ").trim()
    document.querySelector(".songinfo").innerHTML = songinfo
    document.querySelector(".songtime").innerHTML = " 0:00 / 00:00"
    currentsong.addEventListener("ended", () => {
        playNextSong();
    })
}
async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const e = array[index]
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get meta data of the folder 
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card"> 
            <div class="play"> 
            <img src="images/play.svg" alt=""> </div> 
            <img src="/songs/${folder}/cover.webp" alt=""> 
            <h2>${response.title}</h2> 
            <p>${response.description}</p> </div>`
        }
    }
    // load the playlist whenever card is clicked 
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            console.log("done")
            console.log(songs)
            playMusic(songs[0])
        })
    })
}
(async function main() {

    


    await getsongs("songs/powerful")
    playMusic(songs[0], true)
    //display all the albums in the page 
    displayAlbums()
    next.addEventListener("click", () => {
        if (!currentsong.paused) {
            currentsong.pause();
            // Pause the current song before changing it 
        }
        playNextSong();
    });

    //attach an event listener to the play, pause and next button 
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "images/pause.svg"
        } else {
            currentsong.pause()
            play.src = "images/play.svg"
        }
    })


    previous.addEventListener("click", () => {
        if (!currentsong.paused) {
            currentsong.pause();
            // Pause the current song before changing it 
        } playPreviousSong();
    }); // 
    let seekbar = document.querySelector(".seekbar")
    seekbar.addEventListener("click", (e) => {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let percentage = x / rect.width;
        currentsong.currentTime = currentsong.duration * percentage;
    })


    

    // Listen for timeupdate event 
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)
            } / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    // add an event listener for hamburger 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    // add an event listener for close button 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // add an event listener for the volume button 
    let volume = document.querySelector(".volume img")
    volume.addEventListener("click", () => {
        if (currentsong.volume == 0) {
            currentsong.volume = 1
            volume.src = "images/volume.svg"
        } else {
            currentsong.volume = 0
            volume.src = "images/mute.svg"
        }
    })
    let range = document.querySelector(".volume input")
    range.addEventListener("input", () => {
        if (range.value == 0) {
            volume.src = "images/mute.svg"
            currentsong.volume = 0
        } else {
            volume.src = "images/volume.svg"
            currentsong.volume = range.value / 100
        }
    })
})()