<script lang="ts">
  import { SETTINGS } from "$lib/settings-store";
  import { getDpsPlayers, getHealPlayers, getTankedPlayers } from "$lib/stores/live-meter-store.svelte";
  import { getClassColorRaw } from "$lib/utils.svelte";

  function getPlayerRows() {
    const metric = SETTINGS.live.playerOverlay.state.metricType;
    const players =
      metric === "heal"
        ? getHealPlayers().playerRows
        : metric === "tanked"
        ? getTankedPlayers().playerRows
        : getDpsPlayers().playerRows;

    return players.slice(0, SETTINGS.live.playerOverlay.state.maxRows);
  }

  function metricLabel() {
    switch (SETTINGS.live.playerOverlay.state.metricType) {
      case "heal":
        return "Heal";
      case "tanked":
        return "Tanked";
      default:
        return "DPS";
    }
  }
</script>

<div class="min-h-screen p-3" style="background: var(--player-overlay-window, rgba(18, 18, 18, 0.85)); color: var(--surface-foreground, #e2e2e2);">
  <div class="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-black/20 backdrop-blur-xl">
    <div class="mb-3 text-sm uppercase tracking-[0.24em] text-muted-foreground">Player Overlay</div>
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-semibold text-foreground">{metricLabel()} Top {SETTINGS.live.playerOverlay.state.maxRows}</h1>
        <p class="text-xs text-muted-foreground mt-1">Showing the top player rows in the overlay.</p>
      </div>
    </div>

    {#if getPlayerRows().length > 0}
      <div class="mt-4 space-y-2">
        {#each getPlayerRows() as player, index}
          <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <div class="flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full" style="background: {getClassColorRaw(player.className, player.classSpecName)};">
                <span class="text-xs font-semibold text-white">{index + 1}</span>
              </div>
              <div>
                <div class="text-sm font-semibold text-foreground">{player.name}</div>
                <div class="text-[11px] text-muted-foreground">{player.classSpecName || player.className}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-foreground">{player.abilityScore}</div>
              <div class="text-[11px] text-muted-foreground">{player.dps.toFixed(0)} {metricLabel()}</div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="mt-4 rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-muted-foreground">
        Waiting for live players to appear...
      </div>
    {/if}
  </div>
</div>
