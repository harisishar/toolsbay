// Barcode generator Alpine component (JsBarcode bundled in).
import JsBarcode from 'jsbarcode';

export function barcodeApp() {
  return {
    value: '',
    format: 'CODE128',
    displayValue: true,
    lineColor: '#101314',
    height: 90,
    valid: true,

    render() {
      const svg = (this as unknown as { $refs: Record<string, SVGSVGElement> }).$refs.svg;
      if (!this.value) {
        svg.innerHTML = '';
        this.valid = true;
        return;
      }
      try {
        JsBarcode(svg, this.value, {
          format: this.format,
          displayValue: this.displayValue,
          lineColor: this.lineColor,
          height: Number(this.height),
          margin: 12,
          font: 'IBM Plex Sans',
          valid: (ok: boolean) => (this.valid = ok),
        });
      } catch {
        this.valid = false;
        svg.innerHTML = '';
      }
    },

    download(kind: 'svg' | 'png') {
      if (!this.value || !this.valid) return;
      const svg = (this as unknown as { $refs: Record<string, SVGSVGElement> }).$refs.svg;
      const xml = new XMLSerializer().serializeToString(svg);
      if (kind === 'svg') {
        this.save(URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml' })), 'barcode.svg');
        return;
      }
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width * 2;
        c.height = img.height * 2;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        this.save(c.toDataURL('image/png'), 'barcode.png');
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
    },

    save(href: string, name: string) {
      const a = document.createElement('a');
      a.href = href;
      a.download = name;
      a.click();
      if (href.startsWith('blob:')) URL.revokeObjectURL(href);
    },
  };
}

declare global {
  interface Window {
    Alpine: { data(name: string, fn: (...args: unknown[]) => unknown): void };
  }
}

document.addEventListener('alpine:init', () => {
  window.Alpine.data('barcodeApp', barcodeApp as (...args: unknown[]) => unknown);
});
