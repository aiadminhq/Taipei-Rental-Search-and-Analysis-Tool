// URL is available in every runtime we target (browsers, Node >= 18) but is not in lib ES2022.
declare class URL {
  constructor(url: string, base?: string);
  hostname: string;
  pathname: string;
  searchParams: { get(name: string): string | null };
  toString(): string;
}
