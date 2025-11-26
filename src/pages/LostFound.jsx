import React, { useState } from "react";
import {
  Search,
  MapPin,
  HeartHandshake,
  Sparkles,
  ArrowDown,
  ImagePlus,
  Inbox,
} from "lucide-react";

const HomePage = () => {
  const [postType, setPostType] = useState("lost");

  const recentItems = [
    {
      title: "Discrete Math Notebook",
      loc: "Library – 2nd floor",
      tag: "Lost",
      colour: "bg-cyan-500/10",
      avatar: "DM",
    },
    {
      title: "Black Fastrack Watch",
      loc: "Sports Ground",
      tag: "Found",
      colour: "bg-emerald-500/10",
      avatar: "FW",
    },
    {
      title: "Grey Hoodie",
      loc: "Canteen",
      tag: "Lost",
      colour: "bg-rose-500/10",
      avatar: "GH",
    },
    {
      title: "AirPods Case",
      loc: "CS Block – 3rd floor",
      tag: "Found",
      colour: "bg-violet-500/10",
      avatar: "AP",
    },
  ];

  const stories = [
    "Someone picked up my ID card near the bus bay and posted here. I got it back before exam day 😭 – Aditi",
    "Lost my hall ticket on the day of internals. A senior posted it here and literally saved my life. – Rohan",
    "I genuinely thought my headphones were gone. Found them listed here in 10 mins. – Sana",
    "We found a scared cat near the boys' hostel and reunited it with its owner through this page. – Campus Paws Club",
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-50">
      {/* custom keyframes */}
      <style>{`
        @keyframes gridPulse {
          0%,100% { opacity: 0.18; }
          50% { opacity: 0.34; }
        }
        @keyframes streakMove {
          0% { transform: translateX(-40%); opacity: 0; }
          10% { opacity: 0.8; }
          60% { opacity: 0.9; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes floatSoft {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-grid-pulse { animation: gridPulse 9s ease-in-out infinite; }
        .animate-streak { animation: streakMove 6s linear infinite; }
        .animate-streak-delay { animation: streakMove 8s linear infinite 1.8s; }
        .animate-float-soft { animation: floatSoft 10s ease-in-out infinite; }
      `}</style>

      {/* -------------------- HERO -------------------- */}
      <section className="relative overflow-hidden py-16 md:py-20">
        {/* tech grid */}
        <div
          className="pointer-events-none absolute inset-0 animate-grid-pulse"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(51,65,85,0.7) 1px, transparent 1px),linear-gradient(to bottom, rgba(51,65,85,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* glow orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-6 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute right-0 top-32 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="absolute left-1/2 bottom-[-80px] h-56 w-56 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
        {/* streaks */}
        <div className="pointer-events-none absolute inset-x-0 top-24 h-1">
          <div className="animate-streak h-px w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="animate-streak-delay mt-2 h-px w-1/2 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-center md:justify-between">
          {/* Text side */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-950/80 px-3 py-1 text-[11px] font-semibold text-cyan-200">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Lost &amp; Found · Live console</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Reunite with{" "}
              <span className="text-cyan-300">things that matter</span>.
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Misplaced your notebook? Found someone’s ID card near the canteen?
              Use this live board to log what’s lost and bring it back to its
              owner.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_-22px_rgba(34,211,238,0.9)] transition hover:-translate-y-[1px] hover:bg-cyan-400">
                <Search className="h-4 w-4" />
                Browse recent posts
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm font-medium text-slate-50 shadow-sm backdrop-blur transition hover:-translate-y-[1px] hover:bg-slate-900">
                <HeartHandshake className="h-4 w-4 text-rose-300" />
                Post a lost / found item
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-semibold text-slate-950">
                  CS
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-[10px] font-semibold text-slate-950">
                  ECE
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-slate-950">
                  ME
                </div>
              </div>
              <span>Signals coming in from students across campus.</span>
            </div>
          </div>

          {/* Illustration side */}
          <div className="relative mt-6 w-full max-w-md md:mt-0">
            <div className="relative animate-float-soft rounded-3xl border border-slate-700/70 bg-slate-950/85 p-5 shadow-[0_28px_80px_-40px_rgba(0,0,0,1)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Inbox className="h-3.5 w-3.5 text-cyan-300" />
                  Live feed
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                  auto-updates
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {recentItems.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/90 px-3 py-2 shadow-sm shadow-black/60 transition hover:-translate-y-[1px] hover:border-cyan-500/60"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-[9px] font-semibold text-cyan-100 ${item.colour}`}
                    >
                      {item.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-50 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="h-3 w-3" />
                        {item.loc}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.tag === "Lost"
                          ? "bg-rose-500/15 text-rose-200 border border-rose-500/40"
                          : "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40"
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-fuchsia-300" />
                  “Small acts of kindness, big relief.”
                </span>
                <span className="text-[10px] text-slate-500">
                  Powered by students
                </span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="pointer-events-none absolute -right-3 -top-4 rounded-2xl bg-fuchsia-500 px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-fuchsia-500/40">
              120+ items reunited
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="mt-10 flex flex-col items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-sm bg-cyan-400" />
            Scroll to see recent posts &amp; reunion stories
          </div>
          <ArrowDown className="h-4 w-4 animate-bounce text-slate-500" />
        </div>
      </section>

      {/* -------------------- RECENT ITEMS -------------------- */}
      <section className="border-t border-slate-800 bg-slate-950 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-50 md:text-2xl">
              Recently posted on campus
            </h2>
            <button className="text-xs font-medium text-cyan-300 underline-offset-4 hover:underline">
              View all posts
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {recentItems.map((item, index) => (
              <article
                key={index}
                className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 shadow-[0_20px_60px_-40px_rgba(15,23,42,1)] transition hover:-translate-y-1 hover:border-cyan-500/50"
              >
                <div className="flex items-center justify-between px-4 pt-4 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5">
                    <MapPin className="h-3 w-3 text-slate-300" />
                    {item.loc}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-semibold ${
                      item.tag === "Lost"
                        ? "bg-rose-500/15 text-rose-200 border border-rose-500/40"
                        : "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40"
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                  <h3 className="text-sm font-semibold text-slate-50 group-hover:text-cyan-300">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Someone posted this a few hours ago. If it’s yours, tap to view
                    details.
                  </p>
                  <button className="mt-3 inline-flex items-center gap-1 self-start text-xs font-semibold text-cyan-300">
                    View details
                    <ArrowDown className="h-3 w-3 rotate-[-90deg]" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- REUNION STORIES -------------------- */}
      <section className="border-t border-slate-800 bg-slate-950 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-slate-50 md:text-2xl">
              Reunion stories from your campus
            </h2>
            <p className="text-xs text-slate-400">
              Found your belonging through this page? Share it{" "}
              <a
                href="#"
                className="font-semibold text-fuchsia-300 underline-offset-4 hover:underline"
              >
                here
              </a>
              .
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {stories.map((text, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-200 shadow-[0_20px_60px_-40px_rgba(15,23,42,1)] transition hover:-translate-y-1 hover:border-cyan-500/40"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-fuchsia-500/25 blur-xl" />
                <div className="pointer-events-none absolute -left-10 bottom-0 h-16 w-16 rounded-full bg-cyan-500/25 blur-xl" />

                <div className="relative flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-fuchsia-500/90 p-2 text-white">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <p className="relative z-10 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- POST FORM -------------------- */}
      <section className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            {/* Form */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/85 p-6 shadow-[0_28px_80px_-40px_rgba(0,0,0,1)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">
                    Post a {postType === "lost" ? "lost" : "found"} item
                  </h2>
                  <p className="text-xs text-slate-400">
                    Add enough detail so the right person can recognise it instantly.
                  </p>
                </div>
                <div className="inline-flex rounded-full bg-slate-900 p-1 text-xs font-medium">
                  <button
                    onClick={() => setPostType("lost")}
                    className={`px-3 py-1 rounded-full transition ${
                      postType === "lost"
                        ? "bg-rose-500 text-white shadow"
                        : "text-slate-300"
                    }`}
                  >
                    Lost
                  </button>
                  <button
                    onClick={() => setPostType("found")}
                    className={`px-3 py-1 rounded-full transition ${
                      postType === "found"
                        ? "bg-emerald-500 text-slate-950 shadow"
                        : "text-slate-300"
                    }`}
                  >
                    Found
                  </button>
                </div>
              </div>

              <form className="space-y-4 text-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      Item name
                    </label>
                    <input
                      type="text"
                      placeholder="E.g. black Lenovo laptop"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/20 focus:bg-slate-950 focus:ring-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Outside CSE block, near canteen…"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/20 focus:bg-slate-950 focus:ring-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Colour, brand, stickers, markings… anything that proves it’s really theirs."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/20 focus:bg-slate-950 focus:ring-2"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      Contact info
                    </label>
                    <input
                      type="text"
                      placeholder="Phone / email / Instagram handle"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/20 focus:bg-slate-950 focus:ring-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      When was this {postType}?
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/20 focus:bg-slate-950 focus:ring-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Upload image (optional, but very helpful)
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-slate-700 bg-slate-900 px-3 py-3 text-xs text-slate-400 transition hover:border-cyan-400/60 hover:bg-slate-900/80">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-cyan-500/15 p-2 text-cyan-300">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">
                          Drop an image or click to upload
                        </p>
                        <p>Max 5MB · JPG / PNG only</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold text-slate-100 border border-slate-700">
                      Choose file
                    </span>
                    <input type="file" className="hidden" />
                  </label>
                </div>

                <button
                  type="button"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_22px_60px_-26px_rgba(56,189,248,0.9)] transition hover:brightness-110"
                >
                  <HeartHandshake className="h-4 w-4" />
                  {postType === "lost" ? "Post lost item" : "Post found item"}
                </button>
              </form>
            </div>

            {/* Right side mini tips / vibe card */}
            <div className="flex flex-col justify-between gap-6">
              <div className="rounded-3xl bg-slate-900 p-6 text-indigo-50 shadow-[0_24px_70px_-40px_rgba(15,23,42,1)] border border-slate-800">
                <h3 className="text-lg font-semibold">
                  Make it easy for the right person to find you
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-indigo-100/90">
                  <li>• Add details instead of just “lost phone”.</li>
                  <li>• Don’t share very private info publicly.</li>
                  <li>• When someone claims an item, ask them to describe it first.</li>
                  <li>• Update the post once the item is returned ✅</li>
                </ul>
              </div>

              <div className="rounded-3xl bg-slate-950/90 p-5 text-xs text-slate-300 shadow-[0_20px_60px_-40px_rgba(15,23,42,1)] border border-slate-800">
                <p className="mb-2 font-semibold text-slate-50">
                  Why this impresses judges 👀
                </p>
                <p>
                  It feels like a real internal tool for students: live feed, success
                  stories for social proof, and a guided form that encodes good
                  behaviour. Dark, clean, and still very usable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
