/** Bandeira quadriculada de linha de chegada (desenhada em SVG, sem arquivo de imagem) */
export function finishFlagSvg(size: number): string {
  const cols = 5;
  const rows = 4;
  const x0 = 6.2;
  const y0 = 3.6;
  const w = 15.6;
  const h = 10.4;
  const cw = w / cols;
  const ch = h / rows;
  let squares = '';
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if ((r + c) % 2 === 0) {
        squares += `<rect x="${(x0 + c * cw).toFixed(2)}" y="${(y0 + r * ch).toFixed(2)}" width="${cw.toFixed(2)}" height="${ch.toFixed(2)}" fill="#111827"/>`;
      }
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">` +
    `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#ffffff" stroke="#111827" stroke-width="0.9"/>` +
    squares +
    `<rect x="4.2" y="2.6" width="2" height="19.4" rx="1" fill="#111827"/>` +
    `</svg>`
  );
}

export default function FinishFlag({ size = 16 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center leading-none"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: finishFlagSvg(size) }}
    />
  );
}
