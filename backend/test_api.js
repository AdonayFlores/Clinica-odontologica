async function test() {
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: 'chepe@flores.com', password: 'password123' })
  });
  console.log(await loginRes.json());
}
test();
