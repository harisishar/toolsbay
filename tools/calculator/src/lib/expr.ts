// Small scientific-expression evaluator (shunting-yard). No eval().
// Supports + - * / ^ %, parentheses, unary minus, constants pi/e,
// functions sin cos tan asin acos atan log ln sqrt abs exp — trig in
// degrees or radians. Tested in tests/expr.test.mjs.

const FUNCS = [
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "log",
  "ln",
  "sqrt",
  "abs",
  "exp",
];

type Tok =
  | { t: "num"; v: number }
  | { t: "op"; v: string }
  | { t: "fn"; v: string }
  | { t: "(" }
  | { t: ")" };

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const s = src
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-");
  while (i < s.length) {
    const ch = s[i]!;
    if (/[0-9.]/.test(ch)) {
      const m = s.slice(i).match(/^\d*\.?\d+(e[+-]?\d+)?/i)![0];
      toks.push({ t: "num", v: parseFloat(m) });
      i += m.length;
      continue;
    }
    if (/[a-z]/i.test(ch)) {
      const m = s
        .slice(i)
        .match(/^[a-z]+/i)![0]
        .toLowerCase();
      if (m === "pi") toks.push({ t: "num", v: Math.PI });
      else if (m === "e") toks.push({ t: "num", v: Math.E });
      else if (FUNCS.includes(m)) toks.push({ t: "fn", v: m });
      else throw new Error(`Unknown name: ${m}`);
      i += m.length;
      continue;
    }
    if (ch === "(") {
      toks.push({ t: "(" });
      i++;
      continue;
    }
    if (ch === ")") {
      toks.push({ t: ")" });
      i++;
      continue;
    }
    if ("+-*/^%".includes(ch)) {
      // unary minus -> treat as 0 - x when at start or after op/(
      const prev = toks[toks.length - 1];
      if (ch === "-" && (!prev || prev.t === "op" || prev.t === "(")) {
        toks.push({ t: "num", v: 0 });
      }
      toks.push({ t: "op", v: ch });
      i++;
      continue;
    }
    throw new Error(`Unexpected character: ${ch}`);
  }
  return toks;
}

const PREC: Record<string, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "%": 2,
  "^": 3,
};
const RIGHT = new Set(["^"]);

export function evaluate(src: string, mode: "deg" | "rad" = "deg"): number {
  const toks = tokenize(src);
  const out: Tok[] = [];
  const stack: Tok[] = [];
  for (const tok of toks) {
    if (tok.t === "num") out.push(tok);
    else if (tok.t === "fn" || tok.t === "(") stack.push(tok);
    else if (tok.t === ")") {
      while (stack.length && stack[stack.length - 1]!.t !== "(")
        out.push(stack.pop()!);
      if (!stack.length) throw new Error("Mismatched parentheses");
      stack.pop();
      if (stack.length && stack[stack.length - 1]!.t === "fn")
        out.push(stack.pop()!);
    } else {
      while (stack.length) {
        const top = stack[stack.length - 1]!;
        if (
          top.t === "op" &&
          (PREC[top.v]! > PREC[tok.v]! ||
            (PREC[top.v] === PREC[tok.v] && !RIGHT.has(tok.v)))
        ) {
          out.push(stack.pop()!);
        } else break;
      }
      stack.push(tok);
    }
  }
  while (stack.length) {
    const top = stack.pop()!;
    if (top.t === "(") throw new Error("Mismatched parentheses");
    out.push(top);
  }

  const st: number[] = [];
  const toRad = (x: number) => (mode === "deg" ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (mode === "deg" ? (x * 180) / Math.PI : x);
  for (const tok of out) {
    if (tok.t === "num") st.push(tok.v);
    else if (tok.t === "op") {
      const b = st.pop();
      const a = st.pop();
      if (a === undefined || b === undefined)
        throw new Error("Malformed expression");
      st.push(
        tok.v === "+"
          ? a + b
          : tok.v === "-"
            ? a - b
            : tok.v === "*"
              ? a * b
              : tok.v === "/"
                ? a / b
                : tok.v === "%"
                  ? a % b
                  : Math.pow(a, b),
      );
    } else if (tok.t === "fn") {
      const a = st.pop();
      if (a === undefined) throw new Error("Malformed expression");
      const f = tok.v;
      st.push(
        f === "sin"
          ? Math.sin(toRad(a))
          : f === "cos"
            ? Math.cos(toRad(a))
            : f === "tan"
              ? Math.tan(toRad(a))
              : f === "asin"
                ? fromRad(Math.asin(a))
                : f === "acos"
                  ? fromRad(Math.acos(a))
                  : f === "atan"
                    ? fromRad(Math.atan(a))
                    : f === "log"
                      ? Math.log10(a)
                      : f === "ln"
                        ? Math.log(a)
                        : f === "sqrt"
                          ? Math.sqrt(a)
                          : f === "abs"
                            ? Math.abs(a)
                            : Math.exp(a),
      );
    }
  }
  if (st.length !== 1) throw new Error("Malformed expression");
  return st[0]!;
}
