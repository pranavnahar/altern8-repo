export const validatePhoneNumber = (phoneNumber: string) => {
  phoneNumber = phoneNumber.trim();
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phoneNumber);
};

export const validatePassword = (password: string) => {
  password = password.trim();
  return password.length >= 8;
};

export const passwordValidation = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#:])[A-Za-z\d@$!%*?&#:]{8,}$/;
  return passwordRegex.test(password);
};

export const nameValidation = (name: string): boolean => {
  return name.length > 3;
};
