import QRCode from 'qrcode';
import jsPDF from 'jspdf';

// Генерация PDF с QR-кодами размером 2.5×2.5 см, расстояние между ними 0.5 см.
// На листе A4 размещается 6 колонок и 9 рядов (всего 54 QR-кода на странице).
// Позиции рассчитываются так, чтобы всё было отцентрировано.

export default async function QrGenratorInPDF  (keys: string[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const qrSize = 25;        // 2.5 см
  const gap = 5;            // 0.5 см промежуток
  const step = qrSize + gap; // шаг сетки

  const cols = 6;
  const rowsPerPage = 9;

  // Отступы слева/сверху для центрирования блока QR-кодов
  const offsetX = (210 - cols * step) / 2;
  const offsetY = (297 - rowsPerPage * step) / 2;

  for (let i = 0; i < keys.length; i++) {
    if (i % (cols * rowsPerPage) === 0 && i !== 0) {
      doc.addPage(); // новая страница при заполнении предыдущей
    }
    const pos = i % (cols * rowsPerPage);
    const col = pos % cols;
    const row = Math.floor(pos / cols);
    const x = offsetX + col * step;
    const y = offsetY + row * step;

    const qrDataUrl = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/loading?ticket_key=${keys[i]}`,
      { width: 200, margin: 0 }
    );
    doc.addImage(qrDataUrl, 'PNG', x, y, qrSize, qrSize);
  }

  doc.save('tickets-qr.pdf');
}