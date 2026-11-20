const form = document.querySelector("#registrationForm");
const dialog = document.querySelector("#successDialog");
const raffleNumber = document.querySelector("#raffleNumber");
const whatsappLink = document.querySelector("#whatsappLink");
const dialogMessage = document.querySelector("#dialogMessage");
const submitButton = form.querySelector("button[type='submit']");

const STORAGE_KEY = "reuniAkbarParticipants";

function normalizePhone(value) {
  let phone = value.replace(/[^0-9]/g, "");
  if (phone.startsWith("0")) phone = `62${phone.slice(1)}`;
  if (!phone.startsWith("62")) phone = `62${phone}`;
  return phone;
}

function getParticipants() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveParticipant(participant) {
  const participants = getParticipants();
  participants.push(participant);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
}

function nextRaffleNumber() {
  const participants = getParticipants();
  const next = participants.length + 1;
  return `RA-${String(next).padStart(4, "0")}`;
}

function setError(fieldName, message) {
  document.querySelector(`#${fieldName}Error`).textContent = message;
}

function validate() {
  const name = form.elements.name.value.trim();
  const year = form.elements.graduationYear.value.trim();
  const phone = form.elements.phone.value.trim();
  const consent = form.elements.consent.checked;

  setError("name", "");
  setError("graduationYear", "");
  setError("phone", "");

  let valid = true;
  if (name.length < 3) {
    setError("name", "Masukkan nama lengkap.");
    valid = false;
  }
  if (!/^20\d{2}$/.test(year) && !/^19\d{2}$/.test(year)) {
    setError("graduationYear", "Masukkan tahun angkatan yang valid.");
    valid = false;
  }
  if (!/^\d{8,13}$/.test(phone.replace(/^0/, ""))) {
    setError("phone", "Masukkan nomor HP yang valid.");
    valid = false;
  }
  if (!consent) {
    alert("Setujui penggunaan data untuk melanjutkan pendaftaran.");
    valid = false;
  }

  return valid;
}

async function sendToGoogleSheets(participant) {
  const url = window.REUNI_CONFIG?.googleScriptUrl;
  if (!url) return;

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(participant)
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validate()) return;

  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Memproses...";

  const name = form.elements.name.value.trim();
  const year = form.elements.graduationYear.value.trim();
  const phone = normalizePhone(form.elements.phone.value);
  const number = nextRaffleNumber();
  const participant = {
    name,
    graduationYear: year,
    phone,
    raffleNumber: number,
    registeredAt: new Date().toISOString()
  };

  saveParticipant(participant);

  try {
    await sendToGoogleSheets(participant);
  } catch (error) {
    console.warn("Data belum terkirim ke spreadsheet:", error);
  }

  raffleNumber.textContent = number;
  dialogMessage.textContent = `Terima kasih, ${name}. Simpan nomor undian ini untuk doorprize.`;

  const text = encodeURIComponent(
    `Halo ${name}, pendaftaran ${window.REUNI_CONFIG.eventName} berhasil.\n` +
    `Angkatan: ${year}\nNomor undian: ${number}\n` +
    `Simpan pesan ini sebagai bukti registrasi.`
  );
  whatsappLink.href = `https://wa.me/${phone}?text=${text}`;

  dialog.showModal();
  submitButton.disabled = false;
  submitButton.querySelector("span").textContent = "Daftar Sekarang";
  form.reset();
});

document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
