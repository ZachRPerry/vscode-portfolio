export type FileContent = { language: string; value: string };
export type FileMap = Record<string, FileContent>;

export type Command = {
  id: string;
  title: string;
  subtitle?: string;
  keywords?: string[];
  action: () => void;
};

export type TerminalLine = {
  type: "prompt" | "command" | "output";
  content: string;
};
