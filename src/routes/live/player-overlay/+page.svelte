<script lang="ts">
  import type { PlayerRow } from "$lib/api";
  import {
    getDpsPlayers,
    getHealPlayers,
    getTankedPlayers,
  } from "$lib/stores/live-meter-store.svelte";
  import { getClassColorRaw } from "$lib/utils.svelte";

  function isCurrentPlayer(player: PlayerRow) {
    return player.name === "You" || player.name.includes("(You)");
  }

  function findCurrentPlayer() {
    const sources = [
      getDpsPlayers().playerRows,
      getHealPlayers().playerRows,
      getTankedPlayers().playerRows,
    ];

    for (const source of sources) {
      const player = source.find(isCurrentPlayer);
      if (player) return player;
    }

    return null;
  }

  function formatNumber(value: number | null | undefined) {
    if (value === null || value === undefined) return "--";
    return value.toLocaleString();
  }

  function formatPercent(value: number | null | undefined) {
    if (value === null || value === undefined) return "--";
    return `${(value / 100).toFixed(2)}%`;
  }

  function getPrimaryAttackLabel(player: PlayerRow) {
    if (
      player.className === "Frost Mage" ||
      player.className === "Verdant Oracle" ||
      player.className === "Beat Performer"
    ) {
      return "Magic Attack";
    }

    return "Physical Attack";
  }

  function getPrimaryAttackValue(player: PlayerRow) {
    if (getPrimaryAttackLabel(player) === "Magic Attack") {
      return player.magicAttack;
    }

    return player.physicalAttack;
  }

  function getPrimaryStatLabel(player: PlayerRow) {
    if (
      player.className === "Frost Mage" ||
      player.className === "Verdant Oracle" ||
      player.className === "Beat Performer"
    ) {
      return "Intelligence";
    }

    if (player.className === "Marksman") {
      return "Agility";
    }

    return "Strength";
  }

  function getStatRows(player: PlayerRow) {
    return [
      { label: "Attack Speed", value: "--" },
      { label: "Crit Rate", value: formatPercent(player.critStat) },
      { label: "Crit Damage", value: "--" },
      { label: "Lucky", value: formatPercent(player.luckyStat) },
      { label: "Haste", value: formatPercent(player.haste) },
      { label: "Mastery", value: formatPercent(player.mastery) },
      { label: "Versatility", value: "--" },
      {
        label: getPrimaryAttackLabel(player),
        value: formatNumber(getPrimaryAttackValue(player)),
      },
      {
        label: getPrimaryStatLabel(player),
        value: formatNumber(player.baseStrength),
      },
    ];
  }

  const currentPlayer = $derived(findCurrentPlayer());
</script>

<div
  class="min-h-screen p-3"
  style="background: var(--player-overlay-window, rgba(18, 18, 18, 0.85)); color: var(--surface-foreground, #e2e2e2);"
  data-tauri-drag-region
>
  <div
    class="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-black/20 backdrop-blur-xl"
    data-tauri-drag-region
  >
    <div class="mb-3 text-sm uppercase tracking-[0.24em] text-muted-foreground">
      Player Stats
    </div>

    {#if currentPlayer}
      <div class="mb-4 flex items-center gap-3" data-tauri-drag-region>
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
          style="background: {getClassColorRaw(currentPlayer.className, currentPlayer.classSpecName)};"
        >
          {currentPlayer.className.slice(0, 2).toUpperCase()}
        </div>
        <div class="min-w-0">
          <div class="truncate text-base font-semibold text-foreground">
            {currentPlayer.name}
          </div>
          <div class="truncate text-xs text-muted-foreground">
            {currentPlayer.classSpecName || currentPlayer.className}
          </div>
        </div>
      </div>

      <div class="grid gap-2">
        {#each getStatRows(currentPlayer) as stat}
          <div
            class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <div class="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {stat.label}
            </div>
            <div class="text-sm font-semibold text-foreground">
              {stat.value}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-muted-foreground"
      >
        Waiting for your live player row to appear. Start combat, heal, or take
        damage so the parser can identify your current stats.
      </div>
    {/if}
  </div>
</div>
