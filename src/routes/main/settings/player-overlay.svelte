<script lang="ts">
  import { onMount } from "svelte";
  import SettingsSwitch from "./settings-switch.svelte";
  import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
  import { SETTINGS } from "$lib/settings-store";
  import { setOverlayClickthrough } from "$lib/utils.svelte";

  let isVisible = $state(SETTINGS.live.playerOverlay.state.visible);

  async function showOverlay() {
    const overlayWindow = await WebviewWindow.getByLabel("player-overlay");
    await overlayWindow?.show();
    SETTINGS.live.playerOverlay.state.visible = true;
    isVisible = true;
  }

  async function hideOverlay() {
    const overlayWindow = await WebviewWindow.getByLabel("player-overlay");
    await overlayWindow?.hide();
    SETTINGS.live.playerOverlay.state.visible = false;
    isVisible = false;
  }

  async function toggleOverlay() {
    if (isVisible) {
      await hideOverlay();
    } else {
      await showOverlay();
    }
  }

  $effect(() => {
    isVisible = SETTINGS.live.playerOverlay.state.visible;
  });

  $effect(() => {
    if (SETTINGS.live.playerOverlay.state.visible) {
      void showOverlay();
    } else {
      void hideOverlay();
    }
  });

  $effect(() => {
    setOverlayClickthrough(SETTINGS.live.playerOverlay.state.clickthrough);
  });

  onMount(() => {
    isVisible = SETTINGS.live.playerOverlay.state.visible;
  });
</script>

<div class="space-y-3">
  <div class="rounded-lg border border-border/60 bg-card/40 overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
    <div class="px-4 py-3">
      <div class="flex flex-col gap-3">
        <div>
          <h2 class="text-base font-semibold text-foreground">Player Stats Overlay</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            Show a compact live window for your current character stats instead of a top-player leaderboard.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <SettingsSwitch
            bind:checked={SETTINGS.live.playerOverlay.state.visible}
            label="Auto Show Overlay"
            description="Keep the player stats overlay visible when enabled. Use the button below to toggle it immediately."
          />
          <SettingsSwitch
            bind:checked={SETTINGS.live.playerOverlay.state.clickthrough}
            label="Overlay Clickthrough"
            description="Allow clicks to pass through the player stats overlay window."
          />
        </div>

        <div class="rounded-lg border border-border/60 bg-background/40 px-3 py-3 text-sm text-muted-foreground">
          The overlay now focuses on your own live row and can surface crit, lucky, haste, mastery, attack values, HP, rank, and similar parser-backed stats when they are available.
        </div>

        <div class="flex flex-col gap-2 pt-2">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            onclick={toggleOverlay}
          >
            {isVisible ? "Hide Player Stats Overlay" : "Show Player Stats Overlay"}
          </button>
          <p class="text-xs text-muted-foreground">
            Use the theme "Player Overlay Background" color in the Themes tab to adjust the overlay tint or transparency.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
