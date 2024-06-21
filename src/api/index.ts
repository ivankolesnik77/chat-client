const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);
export const fetchMessages = async () => {
  const response = await fetch(`${API_URL}/chat/messages`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
