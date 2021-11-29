export const changeSelect = <T extends unknown>(
  onChange: (value: T) => void,
  { currentTarget }: JSX.TargetedEvent<HTMLSelectElement, Event>,
  transformer: (input: string) => T = (input) => input as T
) => {
  onChange(transformer(currentTarget.value));
};

export const changeInput = <T extends unknown>(
  onChange: (value: T) => void,
  { currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>,
  transformer: (input: string) => T = (input) => input as T
) => {
  onChange(transformer(currentTarget.value));
};
