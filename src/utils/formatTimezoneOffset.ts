export const formatTimezoneOffset = (offset: string): string => {
  if (!offset) return '+0';
  return offset.replace(':00', '');
};