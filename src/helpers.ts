export const convertDateFields = (data: {
  createdAt: Date | number;
  updatedAt: Date | number;
}) => {
  if (data.createdAt instanceof Date) {
    data.createdAt = data.createdAt.getTime();
  }
  if (data.updatedAt instanceof Date) {
    data.updatedAt = data.updatedAt.getTime();
  }
  return data;
};

export const removePasswordField = (data: { password: string }) => {
  if (data && typeof data === 'object' && data.hasOwnProperty('password')) {
    delete data.password;
  }
  return data;
};
