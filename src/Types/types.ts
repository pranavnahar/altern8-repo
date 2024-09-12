export interface authTypes {
  first_name: string;
  phone_number: string;
  password: string;
  password2: string;
}

export interface authSVGProps {
  showPassword: boolean;
  setShowPassword: (s: boolean) => void;
}
