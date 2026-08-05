// Accordion Toggle Function
window.toggleCat = (el) => {
  const parent = el.parentElement;
  parent.classList.toggle("open");
};

// Music Controller (Play/Pause/Autoplay & Status)
document.addEventListener("DOMContentLoaded", () => {
  const bgMusic = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("music-toggle-btn");
  const musicIcon = document.getElementById("music-icon");
  const discIcon = document.getElementById("disc-icon");
  const musicStatus = document.getElementById("music-status");

  if (bgMusic && toggleBtn) {
    bgMusic.volume = 0.5;

    function playMusic() {
      bgMusic.play().then(() => {
        musicIcon.className = "fa-solid fa-pause";
        discIcon.classList.add("spinning");
        musicStatus.innerText = "Playing";
        musicStatus.style.color = "var(--nitro-red)";
      }).catch(err => {
        console.log("Autoplay restriction:", err);
      });
    }

    function pauseMusic() {
      bgMusic.pause();
      musicIcon.className = "fa-solid fa-play";
      discIcon.classList.remove("spinning");
      musicStatus.innerText = "Paused";
      musicStatus.style.color = "var(--text-muted)";
    }

    toggleBtn.addEventListener("click", () => {
      if (bgMusic.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    });

    const handleFirstInteraction = () => {
      if (bgMusic.paused) {
        playMusic();
      }
      document.removeEventListener("click", handleFirstInteraction);
    };
    document.addEventListener("click", handleFirstInteraction, { once: true });
  }
});

// Hide Initial Page Loader Screen after full load
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("fade-out");
    }, 500);
  }
});
