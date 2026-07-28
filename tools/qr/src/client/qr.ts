// QR generator Alpine component. Bundled by esbuild; QRCode lib bundled in.
import QRCode from 'qrcode';
import { wifi, url, email, sms, phone, geo, vcard, type WifiSecurity } from '../lib/payloads.js';

type Fields = {
  url: string;
  text: string;
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  smsPhone: string;
  smsMessage: string;
  phone: string;
  lat: string;
  lng: string;
  firstName: string;
  lastName: string;
  org: string;
  title: string;
  workPhone: string;
  mobile: string;
  vEmail: string;
  website: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const emptyFields: Fields = {
  url: '',
  text: '',
  ssid: '',
  password: '',
  security: 'WPA',
  hidden: false,
  emailTo: '',
  emailSubject: '',
  emailBody: '',
  smsPhone: '',
  smsMessage: '',
  phone: '',
  lat: '',
  lng: '',
  firstName: '',
  lastName: '',
  org: '',
  title: '',
  workPhone: '',
  mobile: '',
  vEmail: '',
  website: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
};

export function qrApp(initialType = 'url') {
  return {
    type: initialType,
    f: { ...emptyFields },
    size: 320,
    ecc: 'M' as 'L' | 'M' | 'Q' | 'H',
    fg: '#101314',
    bg: '#ffffff',
    payload: '',
    svg: '',

    buildPayload(): string {
      const f = this.f;
      switch (this.type) {
        case 'url':
          return url(f.url);
        case 'text':
          return f.text;
        case 'wifi':
          return f.ssid
            ? wifi({ ssid: f.ssid, password: f.password, security: f.security, hidden: f.hidden })
            : '';
        case 'email':
          return f.emailTo
            ? email({ to: f.emailTo, subject: f.emailSubject, body: f.emailBody })
            : '';
        case 'sms':
          return f.smsPhone ? sms({ phone: f.smsPhone, message: f.smsMessage }) : '';
        case 'phone':
          return f.phone ? phone(f.phone) : '';
        case 'geo':
          return f.lat && f.lng ? geo({ lat: f.lat, lng: f.lng }) : '';
        case 'vcard': {
          const v = vcard({
            firstName: f.firstName,
            lastName: f.lastName,
            org: f.org,
            title: f.title,
            phone: f.workPhone,
            mobile: f.mobile,
            email: f.vEmail,
            website: f.website,
            street: f.street,
            city: f.city,
            state: f.state,
            zip: f.zip,
            country: f.country,
          });
          return v.split('\n').length > 3 ? v : '';
        }
        default:
          return '';
      }
    },

    async render() {
      this.payload = this.buildPayload();
      const canvas = (this as unknown as { $refs: Record<string, HTMLCanvasElement> }).$refs.canvas;
      if (!this.payload) {
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        this.svg = '';
        return;
      }
      const opts = {
        errorCorrectionLevel: this.ecc,
        width: Number(this.size),
        margin: 2,
        color: { dark: this.fg, light: this.bg },
      };
      try {
        await QRCode.toCanvas(canvas, this.payload, opts);
        this.svg = await QRCode.toString(this.payload, { ...opts, type: 'svg' });
      } catch {
        /* payload too long for QR capacity — keep last good render */
      }
    },

    download(kind: 'png' | 'jpg' | 'svg') {
      if (!this.payload) return;
      if (kind === 'svg') {
        this.save(URL.createObjectURL(new Blob([this.svg], { type: 'image/svg+xml' })), 'qr-code.svg');
        return;
      }
      const canvas = (this as unknown as { $refs: Record<string, HTMLCanvasElement> }).$refs.canvas;
      if (kind === 'jpg') {
        const c = document.createElement('canvas');
        c.width = canvas.width;
        c.height = canvas.height;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(canvas, 0, 0);
        this.save(c.toDataURL('image/jpeg', 0.92), 'qr-code.jpg');
      } else {
        this.save(canvas.toDataURL('image/png'), 'qr-code.png');
      }
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
  window.Alpine.data('qrApp', qrApp as (...args: unknown[]) => unknown);
});
