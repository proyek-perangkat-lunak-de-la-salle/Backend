import informasiPJK from "../models/informasiPJKModel.js";

const seedDatabase = async () => {
  const clusters = ["Rendah", "Sedang", "Tinggi"];
  const infos = [
    "Meskipun berisiko rendah, penyakit jantung koroner tetap perlu diwaspadai. Menerapkan gaya hidup sehat dengan pola makan bergizi, olahraga teratur, kelola stres, dan konsultasi rutin ke dokter adalah kunci pencegahannya. Konsumsi banyak buah, sayur, biji-bijian utuh, protein tanpa lemak, batasi lemak jenuh, trans, dan kolesterol. Jaga berat badan ideal, berhenti merokok, berolahraga minimal 150 menit per minggu, dan kelola stres dengan baik. Konsultasikan dengan dokter untuk memantau faktor risiko dan mendapatkan rekomendasi pencegahan yang tepat.",
    "Bagi individu dengan risiko sedang, langkah pencegahan penyakit jantung koroner perlu lebih ketat. Terapkan pola makan bergizi seimbang, tingkatkan aktivitas fisik, dan konsultasi rutin dengan dokter untuk pantau kolesterol dan tekanan darah. Patuhi program penurunan berat badan jika diperlukan. Ikuti tes skrining tambahan dan minum obat sesuai resep dokter untuk mengoptimalkan pencegahan. Ingat, deteksi dini dan pengobatan tepat adalah kunci mencegah komplikasi serius dari penyakit jantung koroner.",
    "Bagi individu dengan risiko tinggi, langkah pencegahan penyakit jantung koroner perlu sangat ketat. Lakukan perubahan gaya hidup signifikan untuk menurunkan berat badan, meningkatkan aktivitas fisik, dan mengelola stres. Terapkan diet sehat rendah lemak jenuh, kolesterol, dan natrium. Berhenti merokok dan hindari paparan asap rokok pasif. Kelola kondisi medis lain yang meningkatkan risiko, seperti diabetes, tekanan darah tinggi, dan kolesterol tinggi. Konsultasikan dengan dokter untuk mendapatkan obat dan prosedur medis yang tepat untuk menurunkan risiko dan meningkatkan kesehatan jantung Anda. Ingat, meskipun berisiko tinggi, Anda tetap dapat  mengurangi risiko penyakit jantung koroner dan meningkatkan kesehatan jantung Anda.",
  ];

  for (let i = 0; i < clusters.length; i++) {
    await informasiPJK.create({
      cluster: clusters[i],
      info: infos[i],
    });
  }

  console.log("Database seeded successfully");
};

seedDatabase();