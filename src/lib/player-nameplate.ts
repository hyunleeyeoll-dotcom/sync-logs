import type { PlayerRow } from "$lib/api";

type GeneralNameplateSettings = {
  showYourAbilityScore: boolean;
  showOthersAbilityScore: boolean;
  showSeasonStrengthInMeters: boolean;
  showBattleImaginesInMeters: boolean;
  shortenAbilityScore: boolean;
};

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 100_000 ? 0 : 1,
  }).format(value);
}

function formatPowerValue(value: number, shorten: boolean): string {
  return shorten ? formatCompactNumber(value) : value.toLocaleString();
}

export function getPlayerPowerSummary(
  player: Pick<PlayerRow, "abilityScore" | "seasonStrength">,
  isLocalPlayer: boolean,
  settings: GeneralNameplateSettings,
): string | null {
  const parts: string[] = [];

  const shouldShowAbilityScore = isLocalPlayer
    ? settings.showYourAbilityScore
    : settings.showOthersAbilityScore;

  if (shouldShowAbilityScore && player.abilityScore > 0) {
    parts.push(formatPowerValue(player.abilityScore, settings.shortenAbilityScore));
  }

  if (
    settings.showSeasonStrengthInMeters &&
    typeof player.seasonStrength === "number" &&
    player.seasonStrength > 0
  ) {
    parts.push(formatPowerValue(player.seasonStrength, settings.shortenAbilityScore));
  }

  if (!parts.length) {
    return null;
  }

  return `(${parts.join("+")})`;
}

export function getBattleImagineNames(
  player: Pick<PlayerRow, "battleImagineNames">,
  settings: GeneralNameplateSettings,
): string[] {
  if (!settings.showBattleImaginesInMeters || !player.battleImagineNames?.length) {
    return [];
  }

  return player.battleImagineNames.filter(Boolean).slice(0, 4);
}
