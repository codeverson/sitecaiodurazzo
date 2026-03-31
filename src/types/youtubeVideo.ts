export type YoutubeVideoItem = {
  id: number;
  title: string;
  url: string;
  /** Rótulo editorial opcional (ex.: ao vivo, performance). */
  label: string;
  /** Vazio = thumbnail automática a partir do ID do vídeo. */
  thumbnailUrl: string;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
};
