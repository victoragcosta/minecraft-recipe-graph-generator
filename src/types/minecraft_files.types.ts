type TagFileItem =
  | `${string}:${string}`
  | {
      id: `${string}:${string}`;
      required: boolean;
    };

export type TagFile = {
  replace: boolean;
  values: TagFileItem[];
};
