export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-GB', dateOptions)
    .format(date)
    .replace(/(\d+)(st|nd|rd|th)/, '$1<sup>$2</sup>');

  const formattedTime = new Intl.DateTimeFormat('en-GB', timeOptions).format(date);

  return `${formattedDate}, ${formattedTime}`;
};
export const toTitleCase = (str: string) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
