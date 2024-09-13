export interface authTypes {
  firstName: string;
  phoneNumber: string;
  password: string;
  password2: string;
}

export interface authSVGProps {
  showPassword: boolean;
  setShowPassword: (s: boolean) => void;
}

export interface UserCredentials {
  phoneNumber: string;
  password: string;
  otp: string;
}
