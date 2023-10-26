export const parseDateFilterUsecase = (
  date: string,
): { from: string; to: string } | undefined => {
  if (date === 'today') {
    const from = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const to = tomorrow.toISOString().slice(0, 10);
    return {
      from,
      to,
    };
  }

  if (date === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      from: yesterday.toISOString().slice(0, 10),
      to: new Date().toISOString().slice(0, 10),
    };
  }
  if (date === 'week') {
    const week = new Date();
    week.setDate(week.getDate() - 7);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const to = tomorrow.toISOString().slice(0, 10);
    return {
      from: week.toISOString().slice(0, 10),
      to,
    };
  }
};
