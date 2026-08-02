import { type Calc, num, fmt } from "../calc-types.ts";

const c = (x: Calc) => x;

const UPDATED = "2026-08-01";

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
    title: "Unit Converter — Length, Weight, Volume, Area & Speed",
    desc: "Convert between metric and imperial units: length, weight, volume, area, speed and temperature, instantly and offline.",
    intro:
      "This converts between units across length, weight, volume, temperature, area, speed and data size, updating as you type. Most conversions are a single multiplication by a fixed factor, which is why a converter can cover so many units without much complexity. Temperature is the exception and the interesting case: Celsius and Fahrenheit have different zero points as well as different degree sizes, so converting between them needs both a multiplication and an offset. Get the order wrong and the answer is confidently incorrect. The other place errors hide is in units that share a name but not a size — a US gallon is about 17% smaller than an imperial one, and a US pint is smaller still relative to its British counterpart. Where that ambiguity exists, this converter names the variant explicitly.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Each category defines a base unit and a factor for every other unit against it. Converting from A to B multiplies by A's factor to reach the base, then divides by B's factor. One inch is 0.0254 metres and one foot is 0.3048, so 12 inches is 0.3048 metres, which is exactly one foot.",
          "Temperature works differently because the scales have different origins. Celsius to Fahrenheit is (°C × 9/5) + 32; Fahrenheit to Celsius is (°F − 32) × 5/9. The subtraction has to come first going one way and the addition last going the other — reversing the order is the classic mistake.",
          "Kelvin shares Celsius's degree size but starts at absolute zero, so K = °C + 273.15 with no multiplication at all.",
        ],
      },
      {
        h: "Units that share a name but not a size",
        body: [
          "A US liquid gallon is 3.785 litres; an imperial gallon is 4.546 — about 17% larger. This propagates down through quarts, pints and fluid ounces, so a US pint is 473 ml against an imperial 568 ml. Recipes and fuel economy figures crossing the Atlantic are both routinely misread because of it.",
          "The US fluid ounce and the imperial fluid ounce differ too, though only by about 4%, which makes the error small enough to survive undetected in a recipe. Tons are worse: a US short ton is 907 kg, an imperial long ton is 1,016 kg, and a metric tonne is 1,000 kg — three different masses sharing one word.",
        ],
      },
      {
        h: "Data sizes: 1,000 or 1,024?",
        body: [
          "Storage manufacturers use decimal units, where a gigabyte is 1,000³ bytes. Operating systems have historically used binary units, where the same word meant 1,024³ — about 7.4% more. This is why a 1 TB drive shows as roughly 931 GB once formatted, and why nothing is actually missing.",
          "The IEC introduced separate names to resolve this: kibibyte, mebibyte and gibibyte for the binary powers, leaving kilobyte and megabyte to the decimal ones. Adoption has been partial, so the ambiguity persists in practice and it remains worth checking which convention a figure uses before drawing conclusions from it.",
        ],
      },
    ],
    steps: [
      {
        name: "Pick a category",
        text: "Length, weight, volume, temperature, area, speed or data. The available units change with the category.",
      },
      {
        name: "Choose your source and target units",
        text: "Where US and imperial variants both exist, they are listed separately — check you have the right one.",
      },
      {
        name: "Type the value",
        text: "The conversion updates as you type, so you can adjust the input and watch the result move.",
      },
    ],
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
      {
        q: "How do I convert Celsius to Fahrenheit?",
        a: "Multiply by 9/5 and add 32. Going the other way, subtract 32 first and then multiply by 5/9. The order matters — doing the addition and multiplication in the wrong sequence gives a confidently wrong answer.",
      },
      {
        q: "Is a US gallon the same as an imperial gallon?",
        a: "No. A US gallon is 3.785 litres and an imperial gallon is 4.546 — about 17% larger. The difference carries down through quarts, pints and fluid ounces, which is why recipes and fuel economy figures crossing the Atlantic are so often misread.",
      },
      {
        q: "Why does my 1 TB drive show as 931 GB?",
        a: "Storage manufacturers count a gigabyte as 1,000³ bytes; operating systems have historically used 1,024³, which is about 7.4% more per unit. Nothing is missing — the two are measuring in different bases. The IEC names gibibyte and tebibyte exist to disambiguate, but adoption is partial.",
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
      "Square footage is length multiplied by width, and the arithmetic is the easy part. What causes problems is everything around it: rooms that are not rectangles, the waste allowance you need on top of the measured area, and materials sold in units that do not correspond to square feet. This calculator gives the area from your dimensions and, if you supply a price per square foot, the material cost — but the sections below cover the adjustments that decide whether you order enough. The short version: measure at the widest points, split irregular rooms into rectangles and add them, and buy 10% more than the calculated area for most flooring. Running out mid-job usually means a second delivery and a visible batch mismatch.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Area = length × width. For a room 12 feet by 15 feet, that is 180 square feet. Material cost is that figure multiplied by the price per square foot.",
          "For an irregular room, divide it into rectangles, calculate each separately, and add the results. An L-shaped room is two rectangles; a room with a bay window is the main rectangle plus the bay.",
          "To convert between units, remember that one square metre is about 10.764 square feet — not 3.281, which is the linear conversion. Squaring a linear conversion factor is a frequent and expensive error when ordering from a supplier quoting in the other system.",
        ],
      },
      {
        h: "How much extra to order",
        body: [
          "Add 10% for straightforward rectangular rooms with simple cuts. Add 15% for diagonal or herringbone layouts, which generate far more offcuts, and for rooms with many angles or obstructions.",
          "Large-format tiles and patterned materials that need matching across joins push this higher still. Suppliers generally expect a waste allowance and will advise on their own product, but the calculated area is always a floor rather than an order quantity.",
          "Ordering from the same batch matters as much as ordering enough. Dye lots and production runs vary slightly in shade, and a second order weeks later frequently does not match — visible in a way that a small overspend on the first order is not.",
        ],
      },
      {
        h: "Paint is measured differently",
        body: [
          "Wall paint covers wall area, not floor area, so the floor square footage is the wrong input. Wall area is the room perimeter multiplied by the ceiling height, less the area of doors and windows.",
          "For a 12 by 15 foot room with 8-foot ceilings, the perimeter is 54 feet, giving 432 square feet of wall before deductions. A door and two windows might remove 60 square feet. Coverage is typically quoted per gallon or litre, and two coats are the norm on anything other than a like-for-like repaint — so double the requirement before ordering.",
        ],
      },
    ],
    steps: [
      {
        name: "Measure length and width at the widest points",
        text: "Rooms are rarely perfectly square. Measuring at the widest point means you will not come up short.",
      },
      {
        name: "Split irregular rooms into rectangles",
        text: "Calculate each rectangle separately and add the areas. An L-shape is two rectangles.",
      },
      {
        name: "Add a waste allowance before ordering",
        text: "10% for simple layouts, 15% or more for diagonal patterns and complex rooms. Order it all in one batch.",
      },
    ],
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
      {
        q: "How much extra flooring should I order?",
        a: "10% over the measured area for straightforward rectangular rooms, 15% or more for diagonal and herringbone layouts, which generate far more offcuts. Order it all in one batch — dye lots vary between production runs and a top-up order weeks later often does not match.",
      },
      {
        q: "How many square feet in a square metre?",
        a: "About 10.764. Note this is the linear factor of 3.281 squared — using 3.281 directly is a common and costly mistake when ordering from a supplier quoting in the other system.",
      },
      {
        q: "Can I use this to work out how much paint I need?",
        a: "Not directly, because paint covers walls rather than floors. Wall area is the room perimeter times the ceiling height, less doors and windows. Then double it, since two coats are standard on anything but a like-for-like repaint.",
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
      "Concrete is ordered by volume and mixed by weight, which is why the calculation trips people up. This takes slab dimensions — length, width and thickness — and returns the volume in cubic yards and cubic metres, the approximate weight, and how many 60 lb and 80 lb premix bags it would take, including a 5% waste allowance. The bag count is usually the number that changes people's plans. A slab that sounds modest in feet turns into a surprising quantity of bags, and past roughly one cubic yard, ready-mix delivery is normally both cheaper and dramatically less work than mixing on site. Thickness is the input to get right: it is measured in inches while the other two are in feet, and mixing the units is the single most common error here.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Volume = length × width × thickness, with all three converted to the same unit. Thickness in inches is divided by 12 to become feet, then the result in cubic feet is divided by 27 to give cubic yards.",
          "Worked example on a slab 10 feet by 10 feet at 4 inches thick: thickness is 0.333 feet, so the volume is 10 × 10 × 0.333 = 33.3 cubic feet, or 1.23 cubic yards. Adding 5% for waste gives about 1.3 cubic yards.",
          "Concrete weighs roughly 4,000 lb per cubic yard, so that slab is close to 5,200 lb — about 2.4 tonnes. Worth knowing before assuming a wheelbarrow and an afternoon will cover it.",
        ],
      },
      {
        h: "Bags or ready-mix?",
        body: [
          "An 80 lb bag of premix yields about 0.6 cubic feet, so roughly 45 bags make a cubic yard. A 60 lb bag yields about 0.45 cubic feet, needing around 60 bags per cubic yard.",
          "The 1.23 cubic yard example above is therefore about 58 bags of 80 lb premix — well over two tonnes of material to carry, open and mix, and more than most people can place before the first batches begin to set.",
          "Ready-mix delivery generally becomes competitive on cost somewhere around one cubic yard and is unambiguously better above two, both on price and on the quality of the result. Suppliers usually have a minimum load and a short-load surcharge, so it is worth asking for the total delivered price rather than the per-yard rate.",
        ],
      },
      {
        h: "Why slabs fail, and it is rarely the concrete",
        body: [
          "The usual causes are inadequate base preparation and placing too much material in one pour to finish properly. A compacted sub-base of gravel matters more to a slab's life than a small increase in thickness.",
          "Concrete gains most of its strength in the first week but continues curing for far longer, and keeping it damp during that period substantially improves the outcome. Rapid drying causes surface cracking, which is why slabs poured in hot sun without protection so often craze.",
          "Control joints are the other omission. Concrete will crack as it shrinks; joints decide where. Cutting them at intervals of roughly 24 to 30 times the slab thickness gives the cracking somewhere to go that is not across the middle of your slab.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter length and width in feet",
        text: "Measure the actual formed area, not the nominal size — forms are rarely exactly where you planned.",
      },
      {
        name: "Enter thickness in inches",
        text: "Four inches is standard for a footpath or patio, five to six for a driveway. Note the unit differs from length and width.",
      },
      {
        name: "Compare bag count against ready-mix",
        text: "Above about one cubic yard, check a delivered price. The bag count at that volume is usually more work than it first appears.",
      },
    ],
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
      {
        q: "How thick should a concrete slab be?",
        a: "Four inches is standard for a footpath or patio, five to six inches for a driveway carrying vehicles. Base preparation matters more than a small increase in thickness — a properly compacted gravel sub-base does more for a slab's life than an extra inch of concrete.",
      },
      {
        q: "How much does a cubic yard of concrete weigh?",
        a: "Roughly 4,000 lb, or about 1.8 tonnes. A 10 by 10 foot slab at 4 inches is around 1.23 cubic yards — close to 5,200 lb of material, which is worth knowing before planning to mix it by hand.",
      },
      {
        q: "Why do concrete slabs crack?",
        a: "Concrete shrinks as it cures and will crack somewhere. Control joints, cut at intervals of about 24 to 30 times the slab thickness, decide where. Rapid drying causes surface crazing, so keeping the slab damp during the first week measurably improves the result.",
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
    intro:
      "Give this an IPv4 address with a CIDR prefix — 192.168.1.10/24, for instance — and it returns the network address, broadcast address, subnet mask, wildcard mask, the usable host range and the total host count. Subnetting is one of those topics that is genuinely simple in binary and genuinely confusing in decimal, which is why so much of it is memorised from tables rather than understood. The prefix length is just a count of leading bits that identify the network; everything left over identifies the host. Once that clicks, the mask, the address ranges and the host counts all follow from it mechanically. The sections below work through that logic and cover the two addresses in every subnet that cannot be assigned to a machine, along with the /31 exception that breaks the rule.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "The prefix length is the number of leading bits belonging to the network. A /24 means the first 24 bits are network and the remaining 8 are host, which gives a mask of 255.255.255.0 — 24 ones followed by 8 zeros.",
          "The network address is the IP with all host bits set to zero; the broadcast address is the same with all host bits set to one. Usable hosts are everything in between, which is 2^(32 − prefix) − 2.",
          "Worked example on 192.168.1.10/24: the mask is 255.255.255.0, the network address is 192.168.1.0, the broadcast is 192.168.1.255, and the usable range is 192.168.1.1 to 192.168.1.254 — 254 hosts from 256 addresses.",
        ],
      },
      {
        h: "Why two addresses are always unusable",
        body: [
          "The all-zeros host address identifies the network itself and is what appears in routing tables. The all-ones host address is the broadcast address, which reaches every host on the segment at once. Neither can be assigned to an interface, which is where the minus two comes from.",
          "The cost of this is proportionally brutal on small subnets. A /30 has 4 addresses and 2 usable hosts — half the space lost to overhead. A /24 loses 2 out of 256, which is negligible. This is why point-to-point links, which need exactly two addresses, were so wasteful before /31 support existed.",
          "RFC 3021 permits /31 on point-to-point links precisely to fix that, giving 2 usable addresses from 2 by dispensing with network and broadcast addresses entirely. A /32 describes a single host and is used for loopbacks and host routes.",
        ],
      },
      {
        h: "Reading a mask without a table",
        body: [
          "Each octet of a mask can only take nine values: 0, 128, 192, 224, 240, 248, 252, 254, 255 — corresponding to 0 through 8 bits set. A mask octet of 192 means two bits, so a /18 is 255.255.192.0.",
          "The block size in the last significant octet is 256 minus that octet's value. A /26 has a mask of 255.255.255.192, so the block size is 64 and the subnets start at .0, .64, .128 and .192. This is the fastest way to work out which subnet an address falls in without converting anything to binary.",
          "The wildcard mask, which appears in access control lists and OSPF configuration, is the mask inverted — 0.0.0.255 for a /24. It is the same information expressed the other way round, matching bits that are allowed to vary rather than bits that must match.",
        ],
      },
    ],
    steps: [
      {
        name: "Enter an address with its prefix",
        text: "Standard CIDR notation, such as 10.0.5.37/22. Any address within the subnet works — you do not need the network address.",
      },
      {
        name: "Read the network and broadcast addresses",
        text: "These bound the subnet. Neither can be assigned to a host.",
      },
      {
        name: "Use the host range for assignment",
        text: "Everything between the two bounds is assignable. The count is 2^(32 − prefix) − 2, except on /31 and /32.",
      },
    ],
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
      {
        q: "How many hosts are in a /24?",
        a: "254. A /24 leaves 8 host bits, giving 256 addresses, minus the network and broadcast addresses. The general formula is 2^(32 − prefix) − 2, so a /26 gives 62 and a /30 gives 2.",
      },
      {
        q: "What is a wildcard mask?",
        a: "The subnet mask inverted — 0.0.0.255 for a /24. Access control lists and OSPF use it because they match on bits allowed to vary rather than bits required to match. It carries the same information the other way round.",
      },
      {
        q: "How do I tell which subnet an address belongs to?",
        a: "Take 256 minus the significant mask octet to get the block size. For a /26, the mask octet is 192, so the block size is 64 and subnets begin at .0, .64, .128 and .192. An address of .100 falls in the .64 subnet.",
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
      "This generates passwords using your browser's cryptographic random source, entirely on your device. Nothing is sent anywhere, no password is logged, and the page continues working with the network disconnected — which you can verify by turning off your connection and generating another one. That property matters more than it might seem: a password generator that runs on a server has, by construction, seen every password it produced. Choose a length and a character set, and the tool draws each character independently from your selected alphabet using cryptographically strong randomness rather than the predictable pseudo-random generator most scripts reach for. The sections below explain how password strength is actually measured, why length beats complexity, and where a generated password belongs once you have one.",
    updated: UPDATED,
    sections: [
      {
        h: "How this is calculated",
        body: [
          "Each character is drawn independently and uniformly from your selected alphabet using crypto.getRandomValues, with rejection sampling to avoid the modulo bias that would otherwise make some characters marginally more likely than others.",
          "Strength is measured in bits of entropy: log₂(alphabet size) × length. A 16-character password from the 94 printable ASCII characters carries about 105 bits. A 16-character lowercase-only password carries about 75 bits — still substantial, but a trillion times weaker.",
          "Each additional bit doubles the search space. That is why the comparison between password schemes is best made in bits rather than in vague labels like 'strong', which convey nothing about the actual margin.",
        ],
      },
      {
        h: "Length beats complexity",
        body: [
          "Adding one character to a password multiplies the search space by the size of the alphabet — for mixed-case letters and digits, by 62. Adding symbols to a fixed-length password multiplies it by a much smaller factor, because it only widens the alphabet from 62 to 94.",
          "A 20-character password using only lowercase letters carries about 94 bits, comfortably more than a 12-character password using every symbol on the keyboard, which carries about 79. Length is the more efficient lever, and it produces passwords that are easier to type when you have to.",
          "This is why the old advice about substituting characters — replacing letters with lookalike symbols — is largely useless. Those substitutions are well known to cracking tools, add almost no entropy, and make the password considerably harder to type.",
        ],
      },
      {
        h: "Where a generated password should live",
        body: [
          "In a password manager. A genuinely random 16-character password is not memorable, and any scheme that makes it memorable removes most of the randomness that made it strong.",
          "Reuse is the failure mode that actually matters. Credential stuffing takes passwords exposed in one breach and tries them elsewhere, and it works because reuse is common — not because any individual password was weak. A unique generated password per site makes a breach at one service irrelevant to every other.",
          "Two-factor authentication remains worth enabling regardless of password strength, because it defends against the cases a strong password cannot: phishing, a compromised device, and a breach at the service itself.",
        ],
      },
    ],
    steps: [
      {
        name: "Choose a length",
        text: "16 characters or more for anything that matters. Length raises entropy faster than adding symbols does.",
      },
      {
        name: "Select the character sets",
        text: "Include symbols unless the site rejects them. Some services still impose limits that force a narrower alphabet.",
      },
      {
        name: "Store it in a password manager",
        text: "Do not try to remember it. A unique password per site is what actually defends against credential stuffing.",
      },
    ],
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
      {
        q: "Is a longer password better than a more complex one?",
        a: "Yes, and by a wide margin. A 20-character lowercase password carries about 94 bits of entropy; a 12-character password using every symbol carries about 79. Each extra character multiplies the search space by the alphabet size, which beats widening the alphabet.",
      },
      {
        q: "What are bits of entropy?",
        a: "A measure of how many guesses an attacker would need. It is log₂(alphabet size) × length, and each additional bit doubles the search space. A 16-character password from the full printable ASCII set is about 105 bits. It is a far more useful measure than labels like 'strong'.",
      },
      {
        q: "Should I reuse a strong password across sites?",
        a: "No. Credential stuffing takes passwords exposed in one breach and tries them everywhere else, and it succeeds because of reuse rather than weakness. A unique generated password per site means a breach at one service tells an attacker nothing about the others.",
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
