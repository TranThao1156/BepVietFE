export const login = async (data) => {
  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};
export const register = async (data) => {
  const res = await fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
    return res.json();
};