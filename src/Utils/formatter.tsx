export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date).replace(/(\d+)(st|nd|rd|th)/, '$1<sup>$2</sup>');
};

export const formatINR = (value: string | number) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
};

export const formatPercentage = (value: string | number) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return `${value}%`;
};
