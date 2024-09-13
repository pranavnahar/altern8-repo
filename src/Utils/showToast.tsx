import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "bottom-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
};

export const showToast = (message: string, type = "info", options = {}) => {
  const toastOptions = { ...defaultOptions, ...options };
  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "warning":
      toast.warning(message, toastOptions);
      break;
    case "info":
    default:
      toast.info(message, toastOptions);
  }
};
