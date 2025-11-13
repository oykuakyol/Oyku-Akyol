const plank = document.getElementById("plank");
const weights = document.querySelectorAll(".weight");

let placedWeights = []; // { mass, distance, element }
const maxPerSide = 10;

// Alttaki ağırlıkları sürüklenebilir yap
weights.forEach(w => {
  w.draggable = true;
  w.addEventListener("dragstart", e => {
    e.dataTransfer.setData("mass", w.dataset.mass);
  });
});

// Tahterevalliye sürükleme olayları
plank.addEventListener("dragover", e => e.preventDefault());
plank.addEventListener("drop", handleDrop);

function handleDrop(e) {
  e.preventDefault();
  const mass = Number(e.dataTransfer.getData("mass"));
  const rect = plank.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pivot = rect.width / 2;
  const distance = x - pivot;

  const side = distance < 0 ? "left" : "right";
  const sideCount = placedWeights.filter(w => w.side === side).length;
  if (sideCount >= maxPerSide) return; // limit 10 per side

  // Yeni ağırlık (klon) oluştur
  const clone = document.createElement("div");
  clone.className = "weight on-plank";
  clone.style.left = `${x}px`;
  clone.textContent = mass;
  clone.dataset.mass = mass;

  // Ağırlığı tahtaya ekle
  plank.appendChild(clone);

  // Listeye kaydet
  placedWeights.push({ mass, distance, element: clone, side });

  updateSeesaw();

  // 🔥 TIKLAMA İLE SİLME (geliştirilmiş)
  clone.addEventListener("click", () => {
    // DOM'dan kaldır
    clone.remove();

    // Listeden kaldır
    placedWeights = placedWeights.filter(w => w.element !== clone);

    // Dengeyi yeniden hesapla
    updateSeesaw();
  });
}

function updateSeesaw() {
  if (placedWeights.length === 0) {
    plank.style.transform = "translateX(-50%) rotate(0deg)";
    return;
  }

  // Toplam moment (tork)
  let totalMoment = 0;
  placedWeights.forEach(w => {
    totalMoment += w.mass * w.distance;
  });

  // Açıyı hesapla ve uygula
  const angle = Math.max(-30, Math.min(30, totalMoment * 0.02));
  plank.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}
