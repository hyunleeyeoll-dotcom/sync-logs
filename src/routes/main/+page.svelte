<script lang="ts">
  import HourglassIcon from "virtual:icons/lucide/hourglass";
  import PaletteIcon from "virtual:icons/lucide/palette";
  import RadarIcon from "virtual:icons/lucide/radar";
  import SettingsIcon from "virtual:icons/lucide/settings";
  import UploadIcon from "virtual:icons/lucide/upload-cloud";
  import WrenchIcon from "virtual:icons/lucide/wrench";
  import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

  const launchPads = [
    {
      href: "/live/dps",
      action: "openLiveMeter",
      label: "Open Live Meter",
      description: "Jump into the realtime overlay and track each pull with Sync's live readout.",
      icon: RadarIcon,
      accent: "from-cyan-400/30 via-sky-500/15 to-transparent",
    },
    {
      href: "/main/history",
      label: "Review History",
      description: "Browse saved encounters, inspect breakdowns, and compare runs at a glance.",
      icon: HourglassIcon,
      accent: "from-amber-300/25 via-orange-500/15 to-transparent",
    },
    {
      href: "/main/themes",
      label: "Tune Visuals",
      description: "Shape colors, spacing, and surface styling across the desktop and overlay.",
      icon: PaletteIcon,
      accent: "from-emerald-300/25 via-teal-500/15 to-transparent",
    },
    {
      href: "/main/settings",
      label: "Configure Tools",
      description: "Keep network options, shortcuts, and debugging controls close at hand.",
      icon: SettingsIcon,
      accent: "from-fuchsia-300/25 via-rose-500/15 to-transparent",
    },
  ];

  const milestones = [
    "Unified Sync identity across desktop, web, and updater surfaces",
    "Cleaner shell for live meter, history, themes, and settings",
    "Clear runway for combat-data repairs and validation",
  ];

  const nextSteps = [
    "Finalize Sync-owned backend endpoints and release automation.",
    "Audit packet IDs, skill names, and scene mappings against current game data.",
    "Rework damage formulas and verification paths before wider release.",
  ];

  async function openLiveMeter() {
    const liveWindow = await WebviewWindow.getByLabel('live');
    if (liveWindow) {
      await liveWindow.show();
    }
  }
</script>

<section class="space-y-6">
  <div class="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(110,231,255,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.16),transparent_24%),linear-gradient(135deg,rgba(19,24,33,0.96),rgba(24,32,44,0.92),rgba(11,16,24,0.98))] p-8 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.85)]">
    <div class="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.03),transparent)]"></div>
    <div class="relative grid gap-8 lg:grid-cols-[1.25fr_0.85fr]">
      <div class="space-y-5">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">
          <span class="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]"></span>
          Sync Desktop
        </div>

        <div class="space-y-3">
          <h1 class="max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl">
            A focused desktop shell for live combat tracking.
          </h1>
          <p class="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Sync is built to keep the meter readable, customizable, and easier
            to maintain. This release sharpens the product identity, cleans up
            the navigation flow, and prepares the app for the deeper combat-data
            fixes still ahead.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            onclick={openLiveMeter}
            class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
          >
            <RadarIcon class="h-4 w-4" />
            Launch Live Meter
          </button>
          <a
            href="/main/history"
            class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <HourglassIcon class="h-4 w-4" />
            Explore Saved Logs
          </a>
        </div>
      </div>

      <div class="grid gap-3 self-start">
        {#each milestones as milestone}
          <div class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 backdrop-blur-sm">
            <div class="flex items-start gap-3">
              <div class="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]"></div>
              <p class="text-sm leading-6 text-slate-200">{milestone}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {#each launchPads as pad}
      {#if pad.action === 'openLiveMeter'}
        <button
          type="button"
          onclick={openLiveMeter}
          class="group relative overflow-hidden rounded-[1.4rem] border border-border/60 bg-card/40 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-card/60"
        >
          <div class={`absolute inset-0 bg-gradient-to-br ${pad.accent} opacity-80 transition-opacity group-hover:opacity-100`}></div>
          <div class="relative space-y-4 text-left">
            <div class="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
              <pad.icon class="h-5 w-5" />
            </div>
            <div class="space-y-2">
              <h2 class="text-lg font-semibold text-foreground">{pad.label}</h2>
              <p class="text-sm leading-6 text-muted-foreground">{pad.description}</p>
            </div>
          </div>
        </button>
      {:else}
        <a
          href={pad.href}
          class="group relative overflow-hidden rounded-[1.4rem] border border-border/60 bg-card/40 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-card/60"
        >
          <div class={`absolute inset-0 bg-gradient-to-br ${pad.accent} opacity-80 transition-opacity group-hover:opacity-100`}></div>
          <div class="relative space-y-4">
            <div class="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
              <pad.icon class="h-5 w-5" />
            </div>
            <div class="space-y-2">
              <h2 class="text-lg font-semibold text-foreground">{pad.label}</h2>
              <p class="text-sm leading-6 text-muted-foreground">{pad.description}</p>
            </div>
          </div>
        </a>
      {/if}
    {/each}
  </div>

  <div class="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
    <div class="rounded-[1.4rem] border border-border/60 bg-card/35 p-6">
      <div class="mb-4 flex items-center gap-3">
        <div class="rounded-2xl bg-primary/10 p-3 text-primary">
          <WrenchIcon class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-foreground">Stable Shell</h2>
          <p class="text-sm text-muted-foreground">
            Strong product surfaces make the deeper engineering work easier to land.
          </p>
        </div>
      </div>
      <p class="text-sm leading-7 text-muted-foreground">
        Sync now has a dedicated shell for the live meter, history, themes, and
        settings experience. Keeping those surfaces consistent gives us a safer
        place to improve packet handling, validation, and encounter logic
        without carrying mismatched product cues through the app.
      </p>
    </div>

    <div class="rounded-[1.4rem] border border-border/60 bg-card/35 p-6">
      <div class="mb-4 flex items-center gap-3">
        <div class="rounded-2xl bg-primary/10 p-3 text-primary">
          <UploadIcon class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-foreground">Next Technical Pass</h2>
          <p class="text-sm text-muted-foreground">
            With the shell aligned, the next work can go straight into accuracy and reliability.
          </p>
        </div>
      </div>
      <ul class="space-y-3 text-sm leading-6 text-muted-foreground">
        {#each nextSteps as step}
          <li class="flex gap-3">
            <span class="mt-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
            <span>{step}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>
