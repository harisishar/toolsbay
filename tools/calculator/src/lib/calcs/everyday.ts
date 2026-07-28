import { type Calc, num, fmt } from "../calc-types.ts";

const c = (x: Calc) => x;

// conversions to a base unit per category
const UNITS: Record<string, { base: string; units: Record<string, number> }> = {
  length: {
    base: "m",
    units: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344,
    },
  },
  weight: {
    base: "kg",
    units: {
      g: 0.001,
      kg: 1,
      t: 1000,
      oz: 0.0283495,
      lb: 0.453592,
      st: 6.35029,
    },
  },
  volume: {
    base: "L",
    units: {
      ml: 0.001,
      L: 1,
      "gal (US)": 3.78541,
      "qt (US)": 0.946353,
      "pt (US)": 0.473176,
      "cup (US)": 0.24,
      "fl oz (US)": 0.0295735,
    },
  },
  area: {
    base: "m²",
    units: {
      "cm²": 0.0001,
      "m²": 1,
      ha: 10000,
      "km²": 1e6,
      "ft²": 0.092903,
      "yd²": 0.836127,
      acre: 4046.86,
    },
  },
  speed: {
    base: "m/s",
    units: { "km/h": 0.277778, "m/s": 1, mph: 0.44704, knot: 0.514444 },
  },
};

export const EVERYDAY: Calc[] = [
  c({
    slug: "unit-converter",
    name: "Unit Converter",
    category: "Everyday",
    title: "Unit Converter — Length, Weight, Volume, Area, Speed, Temperature",
    desc: "Convert between metric and imperial units: length, weight, volume, area, speed and temperature, instantly and offline.",
    intro: "Pick a category and units — conversion updates as you type.",
    inputs: [
      {
        key: "cat",
        label: "Category",
        type: "select",
        def: "length",
        options: [
          ["length", "Length"],
          ["weight", "Weight / Mass"],
          ["volume", "Volume"],
          ["area", "Area"],
          ["speed", "Speed"],
          ["temp", "Temperature"],
        ],
        half: true,
      },
      { key: "value", label: "Value", def: 1, step: 0.0001, half: true },
      { key: "from", label: "From", type: "text", def: "km", half: true },
      { key: "to", label: "To", type: "text", def: "mi", half: true },
    ],
    faq: [
      {
        q: "Which units are supported?",
        a: "Length: mm cm m km in ft yd mi. Weight: g kg t oz lb st. Volume: ml L gal qt pt cup fl oz. Area: cm² m² ha km² ft² yd² acre. Speed: km/h m/s mph knot. Temperature: C, F, K.",
      },
    ],
    compute(v) {
      const val = num(v.value);
      if (v.cat === "temp") {
        const from = (v.from ?? "C").toUpperCase()[0];
        const to = (v.to ?? "F").toUpperCase()[0];
        let k: number;
        if (from === "F") k = ((val - 32) * 5) / 9 + 273.15;
        else if (from === "K") k = val;
        else k = val + 273.15;
        let out: number;
        if (to === "F") out = ((k - 273.15) * 9) / 5 + 32;
        else if (to === "K") out = k;
        else out = k - 273.15;
        return {
          rows: [
            {
              label: `${val}°${from} in °${to}`,
              value: fmt(out, 2),
              strong: true,
            },
          ],
        };
      }
      const cat = UNITS[v.cat ?? "length"] ?? UNITS.length!;
      const norm = (u?: string) => {
        const key = Object.keys(cat.units).find(
          (k) => k.toLowerCase() === (u ?? "").trim().toLowerCase(),
        );
        return key;
      };
      const f = norm(v.from);
      const t = norm(v.to);
      if (!f || !t)
        return {
          rows: [
            {
              label: "Units",
              value: `Use: ${Object.keys(cat.units).join(", ")}`,
              strong: true,
            },
          ],
        };
      const out = (val * cat.units[f]!) / cat.units[t]!;
      return {
        rows: [
          {
            label: `${val} ${f} in ${t}`,
            value: fmt(out, 6).replace(/\.?0+$/, ""),
            strong: true,
          },
        ],
      };
    },
  }),
  c({
    slug: "square-footage-calculator",
    name: "Square Footage Calculator",
    category: "Everyday",
    title: "Square Footage Calculator — Area & Material Cost",
    desc: "Calculate the square footage of a room or area and the material cost at a price per square foot.",
    intro:
      "Length × width, with an optional price per square foot for flooring, paint or tiles.",
    inputs: [
      { key: "len", label: "Length (ft)", def: 12, step: 0.01, half: true },
      { key: "wid", label: "Width (ft)", def: 10, step: 0.01, half: true },
      {
        key: "price",
        label: "Price per sq ft (optional)",
        def: 0,
        suffix: "$",
        half: true,
      },
    ],
    faq: [
      {
        q: "How do I handle an L-shaped room?",
        a: "Split it into rectangles, calculate each, and add the areas together. Order 5–10% extra material for cuts and waste.",
      },
    ],
    compute(v) {
      const sqft = num(v.len) * num(v.wid);
      const rows = [
        { label: "Area", value: `${fmt(sqft, 2)} sq ft`, strong: true },
        { label: "In square meters", value: `${fmt(sqft * 0.092903, 2)} m²` },
      ];
      if (num(v.price) > 0)
        rows.push({
          label: "Material cost",
          value: `$${fmt(sqft * num(v.price), 2)}`,
          strong: false,
        });
      return { rows };
    },
  }),
  c({
    slug: "concrete-calculator",
    name: "Concrete Calculator",
    category: "Everyday",
    title: "Concrete Calculator — Slab Volume, Bags & Weight",
    desc: "Work out how much concrete a slab needs: cubic yards/meters, weight, and how many premix bags to buy.",
    intro:
      "Enter slab dimensions to get volume, weight, and 60 lb / 80 lb premix bag counts (with 5% waste).",
    inputs: [
      { key: "len", label: "Length (ft)", def: 10, step: 0.01, half: true },
      { key: "wid", label: "Width (ft)", def: 10, step: 0.01, half: true },
      {
        key: "thick",
        label: "Thickness (inches)",
        def: 4,
        step: 0.25,
        half: true,
      },
    ],
    faq: [
      {
        q: "How many 80 lb bags per cubic yard?",
        a: "About 45 bags of 80 lb premix make one cubic yard. For anything above ~1 cubic yard, ready-mix delivery is usually cheaper and far less work.",
      },
    ],
    compute(v) {
      const cuft = num(v.len) * num(v.wid) * (num(v.thick) / 12);
      const cuydWithWaste = (cuft / 27) * 1.05;
      return {
        rows: [
          {
            label: "Volume (with 5% waste)",
            value: `${fmt(cuydWithWaste, 2)} cubic yards`,
            strong: true,
          },
          { label: "Volume", value: `${fmt(cuft * 0.0283168, 2)} m³` },
          {
            label: "80 lb bags",
            value: `${Math.ceil(cuydWithWaste * 45)} bags`,
          },
          {
            label: "60 lb bags",
            value: `${Math.ceil(cuydWithWaste * 60)} bags`,
          },
          { label: "Approx. weight", value: `${fmt(cuft * 150, 0)} lb` },
        ],
      };
    },
  }),
  c({
    slug: "subnet-calculator",
    name: "IP Subnet Calculator",
    category: "Everyday",
    title: "IP Subnet Calculator — CIDR, Netmask, Ranges & Hosts",
    desc: "Calculate network address, broadcast, usable host range and host count from an IPv4 address and CIDR prefix.",
    intro: "Enter an IPv4 address with a CIDR prefix (e.g. 192.168.1.10/24).",
    inputs: [
      {
        key: "cidr",
        label: "IPv4 / CIDR",
        type: "text",
        def: "192.168.1.10/24",
      },
    ],
    faq: [
      {
        q: "Why are two addresses unusable in each subnet?",
        a: "The all-zeros host is the network address and the all-ones host is broadcast. A /24 has 256 addresses but 254 usable hosts. Exceptions: /31 point-to-point links and /32 single hosts.",
      },
    ],
    compute(v) {
      const m = (v.cidr ?? "")
        .trim()
        .match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
      if (!m)
        return {
          rows: [
            { label: "Result", value: "Format: a.b.c.d/prefix", strong: true },
          ],
        };
      const octs = m.slice(1, 5).map(Number);
      const prefix = Number(m[5]);
      if (octs.some((o) => o > 255) || prefix > 32)
        return {
          rows: [
            {
              label: "Result",
              value: "Invalid address or prefix",
              strong: true,
            },
          ],
        };
      const ip =
        ((octs[0]! << 24) | (octs[1]! << 16) | (octs[2]! << 8) | octs[3]!) >>>
        0;
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      const net = (ip & mask) >>> 0;
      const bcast = (net | (~mask >>> 0)) >>> 0;
      const dots = (x: number) =>
        [x >>> 24, (x >>> 16) & 255, (x >>> 8) & 255, x & 255].join(".");
      const hosts =
        prefix >= 31
          ? prefix === 31
            ? 2
            : 1
          : Math.max(0, 2 ** (32 - prefix) - 2);
      return {
        rows: [
          { label: "Network", value: `${dots(net)}/${prefix}`, strong: true },
          { label: "Netmask", value: dots(mask) },
          { label: "Broadcast", value: prefix >= 31 ? "—" : dots(bcast) },
          {
            label: "Usable range",
            value:
              prefix >= 31
                ? `${dots(net)} – ${dots(bcast)}`
                : `${dots(net + 1)} – ${dots(bcast - 1)}`,
          },
          { label: "Usable hosts", value: fmt(hosts, 0) },
        ],
      };
    },
  }),
  c({
    slug: "password-generator",
    name: "Password Generator",
    category: "Everyday",
    title: "Strong Random Password Generator — Free & Offline",
    desc: "Generate cryptographically strong random passwords with custom length and character sets. Runs offline — nothing is transmitted.",
    intro:
      "Passwords are generated with your browser’s cryptographic randomness and never leave your device — this page even works offline.",
    inputs: [
      { key: "length", label: "Length", def: 16, min: 6, max: 128, half: true },
      {
        key: "sets",
        label: "Characters",
        type: "select",
        def: "all",
        options: [
          ["all", "A-z, 0-9, symbols"],
          ["alnum", "A-z, 0-9"],
          ["alpha", "Letters only"],
          ["pin", "Digits only (PIN)"],
        ],
        half: true,
      },
      { key: "_n", label: "", type: "text", def: "0" },
    ],
    button: "Generate again",
    faq: [
      {
        q: "How long should a password be?",
        a: "16+ random characters for anything important. Length beats complexity: a 20-character random password is astronomically harder to crack than an 8-character one with symbols.",
      },
      {
        q: "Is it safe to generate passwords online?",
        a: "Here, yes: generation uses crypto.getRandomValues locally in your browser. Nothing is sent to any server — you can disconnect from the internet and it still works.",
      },
    ],
    compute(v) {
      const SETS: Record<string, string> = {
        all: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*-_=+?",
        alnum: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789",
        alpha: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz",
        pin: "0123456789",
      };
      const chars = SETS[v.sets ?? "all"] ?? SETS.all!;
      const len = Math.max(4, Math.min(128, Math.round(num(v.length, 16))));
      const buf = new Uint32Array(len);
      crypto.getRandomValues(buf);
      const pw = Array.from(buf, (x) => chars[x % chars.length]).join("");
      const entropy = Math.log2(chars.length) * len;
      return {
        rows: [
          { label: "Password", value: pw, strong: true },
          { label: "Entropy", value: `${fmt(entropy, 0)} bits` },
        ],
        note: "Ambiguous characters (I, l, O, 0/1 lookalikes) are excluded from letter sets.",
      };
    },
  }),
];
