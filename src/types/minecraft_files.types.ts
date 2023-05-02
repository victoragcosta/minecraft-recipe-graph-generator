type TagFileItem =
  | `#${string}:${string}`
  | `${string}:${string}`
  | {
      id: `#${string}:${string}` | `${string}:${string}`;
      required: boolean;
    };

export type TagFile = {
  replace: boolean;
  values: TagFileItem[];
};
