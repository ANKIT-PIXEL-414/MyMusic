const mainContainer = document.querySelector('.main');
const placeholder = document.querySelector('.placeholder');
const timer = document.querySelector('.timer');
const fileName = document.querySelector('.file-nm');
const seek = document.getElementById('seek');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play-pause');
const nextBtn = document.getElementById('next');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const addBtn = document.querySelector('.add-btn');
const fileInput = document.getElementById('file-input');
const audioSelect = document.querySelector('.audio-select');
const player = document.getElementById('player');

const images = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img6.jpg"];
let playlist = [];
let currentTrackIndex = 0;

// Format time as mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Set a random placeholder with fade effect
function setRandomPlaceholder() {
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];

  placeholder.style.transition = "opacity 0.5s ease-in-out";
  placeholder.style.opacity = 0;

  setTimeout(() => {
    placeholder.style.backgroundImage = `url("/assets/Images/${selectedImage}")`;
    placeholder.style.backgroundPosition = "center";
    placeholder.style.backgroundSize = "cover";
    placeholder.style.backgroundRepeat = "no-repeat";
    placeholder.style.opacity = 1;
  }, 250);
}

// Initial placeholder on page load
setRandomPlaceholder();

// Play/pause toggle
playBtn.addEventListener('click', () => {
  if (playIcon.style.display !== 'none') {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'inline';
    player.play();
  } else {
    playIcon.style.display = 'inline';
    pauseIcon.style.display = 'none';
    player.pause();
  }
});

// Seek bar functionality
seek.style.backgroundSize = `${seek.value}% 100%`;
seek.addEventListener('input', e => {
  e.target.style.backgroundSize = `${e.target.value}% 100%`;
  if (player.duration) {
    player.currentTime = (player.duration * e.target.value) / 100;
  }
});

// Trigger file input click
addBtn.addEventListener('click', () => {
  fileInput.click();
});

// Handle multiple audio file uploads
fileInput.addEventListener('change', (eve) => {
  const files = Array.from(eve.target.files).filter(file => file.type.startsWith('audio/'));
  if (files.length === 0) return;

  playlist = files.map(file => ({
    name: file.name,
    url: URL.createObjectURL(file)
  }));

  // Set first track
  currentTrackIndex = 0;
  player.src = playlist[0].url;
  fileName.innerText = playlist[0].name;

  // Update dropdown
  audioSelect.innerHTML = '';
  playlist.forEach((track, index) => {
    const opt = document.createElement('option');
    opt.value = track.url;
    opt.innerText = track.name;
    if (index === 0) opt.selected = true;
    audioSelect.appendChild(opt);
  });

  setRandomPlaceholder();
});

// Dropdown selection
audioSelect.addEventListener('change', (e) => {
  const selectedIndex = playlist.findIndex(track => track.url === e.target.value);
  if (selectedIndex !== -1) currentTrackIndex = selectedIndex;

  player.src = playlist[currentTrackIndex].url;
  player.play();
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'inline';
  fileName.innerText = playlist[currentTrackIndex].name;
  setRandomPlaceholder();
});

// Next / Previous buttons
nextBtn.addEventListener('click', () => {
  if (playlist.length === 0) return;
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  player.src = playlist[currentTrackIndex].url;
  player.play();
  fileName.innerText = playlist[currentTrackIndex].name;
  audioSelect.value = player.src;
  setRandomPlaceholder();
});

prevBtn.addEventListener('click', () => {
  if (playlist.length === 0) return;
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  player.src = playlist[currentTrackIndex].url;
  player.play();
  fileName.innerText = playlist[currentTrackIndex].name;
  audioSelect.value = player.src;
  setRandomPlaceholder();
});

// Update timer and seek bar
player.addEventListener('timeupdate', () => {
  const current = player.currentTime;
  const duration = player.duration || 0;
  timer.innerText = `${formatTime(current)} / ${formatTime(duration)}`;
  const progress = duration ? (current / duration) * 100 : 0;
  seek.value = progress;
  seek.style.backgroundSize = `${progress}% 100%`;
});

// Auto play next track when current ends
player.addEventListener('ended', () => {
  if (playlist.length === 0) return;
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  player.src = playlist[currentTrackIndex].url;
  player.play();
  fileName.innerText = playlist[currentTrackIndex].name;
  audioSelect.value = player.src;
  setRandomPlaceholder();
});
