export const formatReportId = (id: string): string => {
  if (!id) return '';
  const firstFour = id.slice(0, 4);
  const lastFour = id.slice(-4);
  return `Report #${firstFour}...${lastFour}`;
}; 