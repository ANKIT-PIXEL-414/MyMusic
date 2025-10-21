
// ====== Music Player Script ======

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
  if (!seconds || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Random placeholder background
function setRandomPlaceholder() {
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];
  placeholder.style.transition = "opacity 0.5s ease-in-out";
  placeholder.style.opacity = 0;
  setTimeout(() => {
    placeholder.style.backgroundImage = `url("assets/Images/${selectedImage}")`;
    placeholder.style.backgroundPosition = "center";
    placeholder.style.backgroundSize = "cover";
    placeholder.style.backgroundRepeat = "no-repeat";
    placeholder.style.opacity = 1;
  }, 250);
}
setRandomPlaceholder();

// Update icons (sync with play/pause)
function updateIcons(isPlaying) {
  playIcon.style.display = isPlaying ? 'none' : 'inline';
  pauseIcon.style.display = isPlaying ? 'inline' : 'none';
}

// Load a track by index
function loadTrack(index, autoPlay = true) {
  if (!playlist.length) return;
  
  currentTrackIndex = index;
  const track = playlist[currentTrackIndex];
  player.src = track.url;
  fileName.innerText = track.name;
  audioSelect.value = track.url;
  timer.innerText = "00:00 / 00:00";
  setRandomPlaceholder();
  
  if (autoPlay) {
    player.play().catch(() => {});
    updateIcons(true);
  } else {
    updateIcons(false);
  }
}

// Toggle play/pause
playBtn.addEventListener('click', () => {
  if (player.src === "") return;
  if (player.paused) {
    player.play().catch(() => {});
    updateIcons(true);
  } else {
    player.pause();
    updateIcons(false);
  }
});

// Seekbar input control
seek.addEventListener('input', e => {
  if (player.duration) {
    const seekValue = (player.duration * e.target.value) / 100;
    player.currentTime = seekValue;
  }
});

// Seekbar & timer update
player.addEventListener('timeupdate', () => {
  const current = player.currentTime;
  const duration = player.duration || 0;
  const progress = duration ? (current / duration) * 100 : 0;
  seek.value = progress;
  seek.style.backgroundSize = `${progress}% 100%`;
  timer.innerText = `${formatTime(current)} / ${formatTime(duration)}`;
});

// Add files button
addBtn.addEventListener('click', () => fileInput.click());

// Handle file uploads (append, not replace)
fileInput.addEventListener('change', e => {
  const files = Array.from(e.target.files).filter(f => f.type.startsWith('audio/'));
  if (!files.length) return;
  
  const newTracks = files.map(file => ({
    name: file.name,
    url: URL.createObjectURL(file)
  }));
  
  const wasEmpty = playlist.length === 0;
  playlist = [...playlist, ...newTracks];
  
  // Update dropdown
  audioSelect.innerHTML = '';
  playlist.forEach((track, index) => {
    const opt = document.createElement('option');
    opt.value = track.url;
    opt.innerText = track.name;
    if (index === currentTrackIndex) opt.selected = true;
    audioSelect.appendChild(opt);
  });
  
  // Load first track if playlist was empty
  if (wasEmpty) {
    loadTrack(0, false);
  }
});

// Select from dropdown
audioSelect.addEventListener('change', e => {
  const selectedIndex = playlist.findIndex(track => track.url === e.target.value);
  if (selectedIndex !== -1) loadTrack(selectedIndex, true);
});

// Next/Previous buttons
nextBtn.addEventListener('click', () => {
  if (!playlist.length) return;
  const nextIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(nextIndex);
});

prevBtn.addEventListener('click', () => {
  if (!playlist.length) return;
  const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(prevIndex);
});

// Auto play next track on end
player.addEventListener('ended', () => {
  if (!playlist.length) return;
  const nextIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(nextIndex);
});

// Sync icons with actual play/pause
player.addEventListener('play', () => updateIcons(true));
player.addEventListener('pause', () => updateIcons(false));

// Reset when source changes
player.addEventListener('loadedmetadata', () => {
  timer.innerText = `00:00 / ${formatTime(player.duration)}`;
});
