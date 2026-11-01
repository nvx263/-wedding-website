// Cấu hình nhanh: sửa ngày cưới tại đây (năm, tháng - 1, ngày, giờ, phút).
const weddingDate = new Date(2026, 11, 20, 10, 30, 0);

window.addEventListener("load", () => {
  window.setTimeout(() => document.querySelector(".preloader")?.classList.add("done"), 500);
});

// Hiện phần tử khi người xem cuộn tới.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -35px 0px" });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Bộ đếm ngược.
function updateCountdown() {
  const diff = weddingDate.getTime() - Date.now();
  const values = diff <= 0
    ? { days: "00", hours: "00", minutes: "00", seconds: "00" }
    : {
        days: String(Math.floor(diff / 86400000)).padStart(2, "0"),
        hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
        minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0")
      };
  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && el.textContent !== value) { el.textContent = value; el.parentElement?.classList.remove("tick"); void el.offsetWidth; el.parentElement?.classList.add("tick"); }
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Nhạc nền: trình duyệt chỉ cho phát sau khi người dùng chủ động bấm.
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.classList.add("playing");
      musicLabel.textContent = "Tắt nhạc";
    } catch {
      musicLabel.textContent = "Thêm file nhạc";
      alert("Hãy thêm file nhạc tên wedding-music.mp3 vào thư mục assets rồi thử lại.");
    }
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
    musicLabel.textContent = "Bật nhạc";
  }
});

// Thư viện ảnh / lightbox.
const galleryItems = [...document.querySelectorAll(".gallery-item")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
let currentImage = 0;
function showImage(index) {
  currentImage = (index + galleryItems.length) % galleryItems.length;
  lightboxImage.src = galleryItems[currentImage].dataset.full;
  lightboxImage.alt = galleryItems[currentImage].querySelector("img").alt;
}
function openLightbox(index) {
  showImage(index);
  lightbox.classList.add("open");
  document.body.classList.add("no-scroll");
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("no-scroll");
}
galleryItems.forEach((item, index) => item.addEventListener("click", () => openLightbox(index)));
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => showImage(currentImage - 1));
document.getElementById("lightboxNext").addEventListener("click", () => showImage(currentImage + 1));
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(currentImage - 1);
  if (event.key === "ArrowRight") showImage(currentImage + 1);
});

// Đổi ngày hiển thị ở hai vị trí theo cấu hình.
const dateText = `${String(weddingDate.getDate()).padStart(2, "0")} · ${String(weddingDate.getMonth() + 1).padStart(2, "0")} · ${weddingDate.getFullYear()}`;
document.querySelectorAll("[data-wedding-date], .closing-date").forEach((el) => el.textContent = dateText);


// Hiệu ứng bổ sung: thanh tiến độ cuộn trang.
const progressBar = document.getElementById("scrollProgressBar");
let scrollTicking = false;
function updateScrollProgress() {
  if (!progressBar) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  scrollTicking = false;
}
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollProgress);
    scrollTicking = true;
  }
}, { passive: true });
updateScrollProgress();

// Chia nhịp xuất hiện theo nhóm để animation tự nhiên hơn.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reducedMotion) {
  document.querySelectorAll(".timeline-item, .gallery-item, .countdown > div").forEach((el, index) => {
    el.style.transitionDelay = `${(index % 4) * 90}ms`;
  });
  document.querySelectorAll(".story-photo, .wedding-photo, .quote-inner, .date-card").forEach((el, index) => {
    el.classList.add(index % 2 === 0 ? "from-left" : "from-right");
    revealObserver.observe(el);
  });
}

// Cánh hoa rơi nhẹ, tắt tự động nếu người xem yêu cầu giảm chuyển động.
const petalLayer = document.getElementById("petalLayer");
if (petalLayer && !reducedMotion) {
  const petalCount = window.innerWidth < 700 ? 7 : 13;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.setProperty("--left", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${5 + Math.random() * 8}px`);
    petal.style.setProperty("--duration", `${13 + Math.random() * 17}s`);
    petal.style.setProperty("--delay", `${-Math.random() * 25}s`);
    petal.style.setProperty("--sway", `${-55 + Math.random() * 110}px`);
    petal.style.setProperty("--opacity", `${0.18 + Math.random() * 0.25}`);
    petalLayer.appendChild(petal);
  }
}

// Parallax rất nhẹ cho ảnh lớn, chỉ chạy trên máy tính để giữ trải nghiệm mobile mượt.
const canParallax = !reducedMotion && window.matchMedia("(min-width: 801px)").matches;
if (canParallax) {
  const parallaxItems = [
    { el: document.querySelector(".hero-image"), factor: 0.10 },
    { el: document.querySelector(".closing-image"), factor: 0.06 }
  ].filter(item => item.el);
  let parallaxFrame = false;
  window.addEventListener("scroll", () => {
    if (parallaxFrame) return;
    parallaxFrame = true;
    window.requestAnimationFrame(() => {
      parallaxItems.forEach(({ el, factor }) => {
        const rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * factor;
          el.style.backgroundPosition = `center calc(50% + ${offset}px)`;
          if (el.classList.contains("closing-image")) el.style.transform = `translateY(${offset}px) scale(1.08)`;
        }
      });
      parallaxFrame = false;
    });
  }, { passive: true });
}

// Nhấn phím Tab/Enter vẫn hoạt động; khi mở lightbox thì đưa focus vào nút đóng.
const lightboxCloseButton = document.getElementById("lightboxClose");
const originalOpenLightbox = openLightbox;
openLightbox = function(index) {
  originalOpenLightbox(index);
  lightboxCloseButton?.focus();
};
