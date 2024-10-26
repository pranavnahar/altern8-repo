export const formatIndianNumber = (number: number) => {
  const [integerPart, decimalPart] = number.toString().split('.');
  const lastThreeDigits = integerPart.substring(integerPart.length - 3);
  const otherDigits = integerPart.substring(0, integerPart.length - 3);
  const formattedIntegerPart =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (otherDigits ? ',' : '') + lastThreeDigits;
  return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
};
