// Sign Up
export const signUpUser = async (userInput) => {
  const endpoint = 'https://weather-app-backend-fdzb.onrender.com/api/users';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInput),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Server Error: ${response.status}`);
  }

  return data;
};

// Login
export const signInUser = async (userInput) => {
  const endpoint = 'https://weather-app-backend-fdzb.onrender.com/api/users/auth';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInput),
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error(`Unexpected response format: ${response.status}`);
  }

  if (!response.ok) {
    throw new Error(data.message || `Server Error: ${response.status}`);
  }

  return data;
};
