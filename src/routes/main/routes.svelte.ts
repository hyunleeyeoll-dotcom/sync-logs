/**
 * @file This file defines the routes for the sidebar.
 */
import HomeIcon from "virtual:icons/lucide/house";
import HourglassIcon from "virtual:icons/lucide/hourglass";
import SettingsIcon from "virtual:icons/lucide/settings";
import UploadIcon from "virtual:icons/lucide/upload-cloud";
import PaletteIcon from "virtual:icons/lucide/palette";
import DiscordIcon from "virtual:icons/lucide/external-link";

// Object keys maintain insertion order in JavaScript
export const SIDEBAR_ROUTES = {
  "/main": { label: "Home", icon: HomeIcon },
  "/main/history": { label: "History", icon: HourglassIcon },
  "/main/uploading": { label: "Uploading", icon: UploadIcon },
  "/main/themes": { label: "Themes", icon: PaletteIcon },
  "/main/settings": { label: "Settings", icon: SettingsIcon },
  "/discord": {
    label: "Discord",
    icon: DiscordIcon,
    externalUrl: "https://discord.gg/EXyaYHf2cA",
  },
};
