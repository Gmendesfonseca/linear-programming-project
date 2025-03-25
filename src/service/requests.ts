export async function calc() {
  const response = await fetch('http://localhost:5000/calc');
  const data = await response.json();
  return data;
}
