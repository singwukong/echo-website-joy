import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import duckNasdaq from "@/assets/duck-nasdaq.jpg";
import duckFloor from "@/assets/duck-floor.jpg";
import duckPfp from "@/assets/duck-pfp.png";
import duckDex from "@/assets/duck-dex.jpg";
import duckCash from "@/assets/duck-cash.jpg";
import duckOval from "@/assets/duck-oval.jpg";
import duckBoxing from "@/assets/duck-boxing.jpg";
import duckTaco from "@/assets/duck-taco.jpg";

const CA = "7Y7V1a4m2nWK7BMgbka5B4vR1pDvCK7yva3Hnrqkraze";
const PAIR = "937nYYCPzqygDm71FX5XJzepDCnJLca9GSfe5essZK2H";
const OTC = `https://otcdesks.cash/coin/${CA}`;
const X_COMMUNITY = "https://x.com/i/communities/1976387426680701119";
const DEX = `https://dexscreener.com/solana/${PAIR}`;

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Nasduck ($NASDUCK) — Same Markets, Different Quack" },
      {
        name: "description",
        content:
          "Nasduck is the Solana duck meme coin parodying Nasdaq. Live price, tokenomics, DEX Screener chart, memes and how to buy $NASDUCK.",
      },
      { property: "og:title", content: "Nasduck ($NASDUCK) — Same Markets, Different Quack" },
      {
        property: "og:description",
        content:
          "Live $NASDUCK price, chart, tokenomics and meme gallery. From Wall Street to Web3, the duck simply different.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Pair = {
  priceUsd?: string;
  marketCap?: number;
  fdv?: number;
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  txns?: { h24?: { buys?: number; sells?: number } };
  priceChange?: { h24?: number };
};

const fmtUsd = (n?: number) =>
  n === undefined || n === null
    ? "—"
    : "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

const fmtPrice = (s?: string) => {
  if (!s) return "—";
  const n = Number(s);
  return "$" + (n < 0.01 ? n.toPrecision(4) : n.toFixed(4));
};

function useTape() {
  const [pair, setPair] = useState<Pair | null>(null);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${PAIR}`);
        const j = await r.json();
        if (alive) setPair(j?.pair ?? j?.pairs?.[0] ?? null);
      } catch {
        /* keep last values */
      }
    };
    load();
    const id = setInterval(load, 20000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return pair;
}

const MARQUEE = [
  "SAME MARKETS, DIFFERENT QUACK",
  "$NASDUCK",
  "PRESSURE BUILDS LEGENDS",
  "BUY THE DIP — DUCKS LOVE DIPS",
  "FROM WALL STREET TO WEB3",
  "QUACK TO THE MOON",
];

const STEPS = [
  ["01", "Get a Solana wallet", "Install Phantom or Solflare on your phone or browser."],
  ["02", "Fund with SOL", "Buy SOL on any exchange and send it to your wallet."],
  ["03", "Open the OTC page", "Head to the official OTC Desks listing for $NASDUCK."],
  ["04", "Swap and quack", "Paste the CA, swap your SOL, and welcome to the pond."],
];

const MEMES = [
  [duckPfp, "Nasduck profile art with green goggles"],
  [duckNasdaq, "Nasduck outside the Nasdaq building"],
  [duckFloor, "Nasduck walking the Nasduck trading floor"],
  [duckDex, "Nasduck close-up in swimming goggles"],
  [duckCash, "Nasduck benching stacks of cash"],
  [duckOval, "Nasduck in the Oval Office"],
  [duckBoxing, "Nasduck boxing a paper-bag cat"],
  [duckTaco, "Nasduck at a late night taco joint"],
];

const FAQ = [
  [
    "What is Nasduck?",
    "Nasduck twists Nasdaq into a duck meme coin — a finance parody that jokes it'll one day list on the exchange. Same markets, different quack.",
  ],
  [
    "Why a swimming duck?",
    "The goggles-and-swim-cap duck nods to market dips: while everyone panics, the duck just swims. Pure Solana animal absurdity mixed with Wall Street lingo.",
  ],
  [
    "Where did it come from?",
    "It gained traction through calls on X and Moonshot verification, then launched on OTC Desks. The community lives in the official X community.",
  ],
  [
    "Is there a tax?",
    "No tax. Liquidity is on PumpSwap and the contract address is fixed — always verify the CA above before buying.",
  ],
  [
    "How do I know the data here is real?",
    "Price, market cap, FDV, volume and liquidity are pulled live from DEX Screener every 20 seconds, and the chart below is the official DEX Screener embed.",
  ],
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-lg tabular-nums text-primary">{value}</div>
    </div>
  );
}

function Index() {
  const pair = useTape();
  const [copied, setCopied] = useState(false);
  const change = pair?.priceChange?.h24;
  const trades =
    pair?.txns?.h24 ? (pair.txns.h24.buys ?? 0) + (pair.txns.h24.sells ?? 0) : undefined;

  return (
    <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
      <div className="sticky top-0 z-40 border-b border-border/70 bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-2 font-mono text-sm">
            <span className="shrink-0 rounded bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground">
              $NASDUCK
            </span>
            <span className="truncate tabular-nums">
              {pair ? (
                <>
                  {fmtPrice(pair.priceUsd)}{" "}
                  <span className={change && change < 0 ? "text-tape-down" : "text-tape-up"}>
                    {change === undefined ? "" : `${change > 0 ? "+" : ""}${change.toFixed(2)}%`}
                  </span>
                </>
              ) : (
                "loading…"
              )}
            </span>
          </div>
          <div className="hidden gap-6 font-mono text-xs text-muted-foreground sm:flex">
            <span>MC {fmtUsd(pair?.marketCap)}</span>
            <span>VOL24H {fmtUsd(pair?.volume?.h24)}</span>
            <span>LIQ {fmtUsd(pair?.liquidity?.usd)}</span>
          </div>
        </div>
      </div>

      <header className="hidden border-b border-border md:block">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-2xl text-primary">NASDUCK</span>
          <div className="flex items-center gap-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <a href="#buy">How to buy</a>
            <a href="#tokenomics">Tokenomics</a>
            <a href="#chart">Chart</a>
            <a href="#memes">Memes</a>
            <a href="#faq">FAQ</a>
            <a
              href={OTC}
              target="_blank"
              rel="noreferrer"
              className="rounded bg-primary px-4 py-2 text-primary-foreground"
            >
              Buy on OTC
            </a>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:px-6 md:py-16">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            NASDUCK:QQQ · Solana
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] md:text-7xl">
            Same markets.
            <br />
            <span className="text-primary">Different quack.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
            Nasduck is the duck that bought the dip before the dip had a name. From Wall Street to
            Web3 — a Nasdaq parody wearing swimming goggles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={OTC}
              target="_blank"
              rel="noreferrer"
              className="neon-frame rounded bg-primary px-6 py-3 font-display text-xl text-primary-foreground"
            >
              Buy $NASDUCK
            </a>
            <a
              href={X_COMMUNITY}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-border px-6 py-3 font-display text-xl"
            >
              X Community
            </a>
          </div>
          <div className="mt-6 max-w-md">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(CA);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="flex w-full min-w-0 items-center gap-3 rounded-lg border border-primary/40 bg-card px-4 py-3 text-left transition-colors hover:bg-secondary"
            >
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                CA
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-xs">{CA}</span>
              <span className="shrink-0 text-xs font-bold text-primary">
                {copied ? "COPIED" : "COPY"}
              </span>
            </button>
          </div>
        </div>
        <img
          src={duckNasdaq}
          alt="Nasduck in a crown cap and green goggles in front of the Nasdaq screens"
          className="neon-frame w-full rounded-xl object-cover"
        />
      </section>

      <div className="overflow-hidden border-y border-border bg-primary/10 py-2">
        <div className="marquee-track whitespace-nowrap font-display text-xl text-primary">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="px-6">
              {t} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section id="tokenomics" className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h2 className="text-3xl md:text-4xl">Tokenomics · live tape</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pulled from DEX Screener every 20 seconds.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat label="Price" value={fmtPrice(pair?.priceUsd)} />
          <Stat label="Market cap" value={fmtUsd(pair?.marketCap)} />
          <Stat label="FDV" value={fmtUsd(pair?.fdv)} />
          <Stat label="24h volume" value={fmtUsd(pair?.volume?.h24)} />
          <Stat label="Liquidity" value={fmtUsd(pair?.liquidity?.usd)} />
          <Stat
            label="24h trades"
            value={trades === undefined ? "—" : trades.toLocaleString("en-US")}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Supply" value="1,000,000,000" />
          <Stat label="Tax" value="0% / 0%" />
          <Stat label="Chain · DEX" value="Solana · PumpSwap" />
        </div>
      </section>

      <section id="chart" className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <h2 className="text-3xl md:text-4xl">Live chart</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <iframe
            title="Nasduck DEX Screener chart"
            src={`https://dexscreener.com/solana/${PAIR}?embed=1&theme=dark&info=0`}
            className="h-[520px] w-full md:h-[680px]"
          />
        </div>
        <a
          href={DEX}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-primary"
        >
          Open full chart on DEX Screener →
        </a>
      </section>

      <section id="buy" className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h2 className="text-3xl md:text-4xl">How to buy</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {STEPS.map(([n, title, body]) => (
            <li key={n} className="rounded-lg border border-border bg-card p-5">
              <div className="font-display text-3xl text-primary">{n}</div>
              <div className="mt-1 font-semibold">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
        <a
          href={OTC}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded bg-primary px-6 py-3 font-display text-xl text-primary-foreground"
        >
          Buy on OTC Desks
        </a>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h2 className="text-3xl md:text-4xl">The lore</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4 text-sm text-muted-foreground md:text-base">
            <p>
              Nasduck twists Nasdaq into a duck meme coin, joking it will list on the exchange like
              a full finance parody. The pun plays on the stock market's Nasdaq as "Nasduck", with
              the swimming duck nodding to market dips — or just the random animal absurdity Solana
              runs on.
            </p>
            <p>
              It gained traction via calls on X and Moonshot verification, riding crypto's love for
              blending Wall Street lingo with silly visuals. Discipline, patience, conviction,
              bigger plans.
            </p>
          </div>
          <img
            src={duckFloor}
            alt="Nasduck strutting across a trading floor under NASDUCK screens"
            className="w-full rounded-xl border border-border object-cover"
          />
        </div>
      </section>

      <section id="memes" className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h2 className="text-3xl md:text-4xl">Meme gallery</h2>
        <div className="mt-6 columns-2 gap-3 md:columns-3 [&>*]:mb-3">
          {MEMES.map(([src, alt]) => (
            <img
              key={src}
              src={src}
              alt={alt}
              loading="lazy"
              className="w-full rounded-lg border border-border"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h2 className="text-3xl md:text-4xl">From the flock</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest posts from{" "}
          <a
            href="https://x.com/NASDUCKOTC"
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            @NASDUCKOTC
          </a>
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card p-2">
          <a
            className="twitter-timeline"
            data-theme="dark"
            data-height="640"
            data-chrome="noheader nofooter transparent"
            href="https://twitter.com/NASDUCKOTC"
          >
            Tweets by @NASDUCKOTC
          </a>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h2 className="text-3xl md:text-4xl">FAQ</h2>
        <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold">
                <span className="mr-2 text-primary">›</span>
                {q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-4 py-10 text-center md:px-6">
        <img
          src={duckPfp}
          alt="Nasduck mascot"
          className="mx-auto h-20 w-20 rounded-full border border-primary object-cover"
        />
        <p className="mt-4 font-display text-2xl text-primary">$NASDUCK</p>
        <div className="mt-2 flex justify-center gap-4 text-sm text-muted-foreground">
          <a href="https://x.com/NASDUCKOTC" target="_blank" rel="noreferrer">
            X
          </a>
          <a href={X_COMMUNITY} target="_blank" rel="noreferrer">
            Community
          </a>
          <a href={OTC} target="_blank" rel="noreferrer">
            OTC
          </a>
          <a href={DEX} target="_blank" rel="noreferrer">
            DEX Screener
          </a>
        </div>
        <p className="mx-auto mt-4 max-w-lg text-xs text-muted-foreground">
          $NASDUCK is a meme coin with no intrinsic value or expectation of financial return. Not
          affiliated with Nasdaq, Inc. Do your own research.
        </p>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-5">
          {[
            ["#buy", "🛒", "Buy"],
            ["#tokenomics", "📈", "Stats"],
            ["#chart", "🕯️", "Chart"],
            ["#memes", "🖼️", "Memes"],
          ].map(([href, icon, label]) => (
            <li key={label}>
              <a
                href={href}
                className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                <span className="text-base leading-none">{icon}</span>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://x.com/NASDUCKOTC"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-primary"
            >
              <span className="text-base leading-none">𝕏</span>Follow
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
