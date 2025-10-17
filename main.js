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

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
const images = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img6.jpg"];

// Function to pick a random image
function setRandomPlaceholder() {
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];
  placeholder.style.background = `url("/assets/Images/${selectedImage}") center/cover no-repeat`;
}
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

seek.style.backgroundSize = `${seek.value}% 100%`;
seek.addEventListener('input', e => {
  e.target.style.backgroundSize = `${e.target.value}% 100%`;
  if (player.duration) {
    player.currentTime = (player.duration * e.target.value) / 100;
  }
});

addBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (eve) => {
  setRandomPlaceholder();
  const files = eve.target.files;
  if (files.length > 0) {
    const firstFile = files[0];
    fileName.innerText = firstFile.name;
    player.src = URL.createObjectURL(firstFile);
    
    audioSelect.innerHTML = '';
    for (let i = 0; i < files.length; i++) {
      const opt = document.createElement('option');
      opt.value = URL.createObjectURL(files[i]);
      opt.innerText = files[i].name;
      audioSelect.appendChild(opt);
    }
  } else {
    fileName.innerText = "No file selected";
    audioSelect.innerHTML = '<option value="none">none</option>';
  }
});

audioSelect.addEventListener('change', (e) => {
  player.src = e.target.value;
  player.play();
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'inline';
});

// Update timer and seek bar as audio plays
player.addEventListener('timeupdate', () => {
  const current = player.currentTime;
  const duration = player.duration || 0;
  timer.innerText = `${formatTime(current)} / ${formatTime(duration)}`;
  const progress = duration ? (current / duration) * 100 : 0;
  seek.value = progress;
  seek.style.backgroundSize = `${progress}% 100%`;
});

