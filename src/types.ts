export type Category = "all" | "bangladeshi" | "international" | "entertainment" | "islamic" | "sports" | "kids" | "event";

export interface Channel {
  name: string;
  category: Category | string;
  logo: string;
  url: string;
}

export interface EventData {
  title: string;
  desc: string;
  url: string;
}
