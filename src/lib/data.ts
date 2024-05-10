import { EPlatform } from "@/types/misc.type";
import { TWizardShareButton } from "@/types/wizard.type";

export const shareIcons: TWizardShareButton[] = [
  {
    name: "Telegram",
    active: "/images/share/telegram-active.webp",
    inactive: "/images/share/telegram-inactive.webp",
    platform: EPlatform.TELEGRAM,
  },
  {
    name: "Discord",
    active: "/images/share/discord-active.webp",
    inactive: "/images/share/discord-inactive.webp",
    platform: EPlatform.DISCORD,
  },
];

export const emojis = [
  { emoji_type: "heart_eyes", type: "gif" },
  // { emoji_type: 'umbrella', type: 'gif' },
  { emoji_type: "lfg", type: "gif" },
  { emoji_type: "sigh", type: "gif" },
  { emoji_type: "tea_cup", type: "png" },
  // { emoji_type: 'smiley_face', type: 'png' },
  { emoji_type: "sleeping", type: "png" },
  // { emoji_type: 'tears_of_joy', type: 'png' },
  { emoji_type: "side_eye", type: "png" },
  { emoji_type: "crying", type: "png" },
  { emoji_type: "enraged_face", type: "png" },
  { emoji_type: "salute", type: "png" },
];

export const emojiIconsMap = {
  heart_eyes: "😍",
  enraged_face: "😡",
  tears_of_joy: "😂",
  tea_cup: "🍵",
  crying: "😭",
  sleeping: "😴",
  side_eye: "😒",
  smiley_face: "😊",
  sigh: "😮‍💨",
  lfg: "🕺",
  umbrella: "☂️",
  salute: "🫡",
};
