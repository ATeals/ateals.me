export const Switch = <T extends object>({
  value,
  caseBy,
  defaultComponent,
}: {
  value?: keyof T;
  caseBy: T;
  defaultComponent?: React.ReactNode;
}) => {
  if (!value) {
    return defaultComponent;
  }

  return caseBy[value] ?? defaultComponent;
};
