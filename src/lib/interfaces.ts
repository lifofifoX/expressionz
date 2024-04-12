export interface InputSticker {
  sticker: string;
  emoji_list: string[];
  name?: string;
}

export type EmojiTypes =
  | 'heart_eyes'
  | 'sleeping'
  | 'smiley_face'
  | 'tea_cup'
  | 'tears_of_joy'
  | 'umbrella'
  | 'lfg'
  | 'sigh'
  | 'side_eye'
  | 'crying'
  | 'enraged_face'
  | 'salute';