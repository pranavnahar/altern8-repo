export const renderHTML = (text: string) => {
  const element = document.createElement("div");
  if (text) {
    element.innerHTML = text;
    return element.textContent ?? text;
  }
  return text;
};
