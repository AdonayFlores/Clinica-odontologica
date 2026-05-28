const fetch = require('node-fetch');
async function test() {
  try {
    // We don't have the password for chepe@flores.com, let's just make a token!
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id_usuario: 1, rol: 'admin' }, 'clinica_odontologica_secret_2026_muy_seguro', { expiresIn: '1h' });
    
    const headers = { 'Authorization': `Bearer ${token}` };
    
    console.log("Fetching paciente 2...");
    const pRes = await fetch('http://127.0.0.1:3001/api/pacientes/2', { headers });
    console.log(pRes.status, await pRes.text());
    
    console.log("Fetching citas...");
    const cRes = await fetch('http://127.0.0.1:3001/api/citas', { headers });
    console.log(cRes.status, (await cRes.text()).substring(0,100));
    
    console.log("Fetching historial 2...");
    const hRes = await fetch('http://127.0.0.1:3001/api/pacientes/2/historial', { headers });
    console.log(hRes.status, (await hRes.text()).substring(0,100));

    console.log("Fetching insumos...");
    const iRes = await fetch('http://127.0.0.1:3001/api/insumos', { headers });
    console.log(iRes.status, (await iRes.text()).substring(0,100));

    console.log("Fetching odontologos...");
    const oRes = await fetch('http://127.0.0.1:3001/api/odontologos', { headers });
    console.log(oRes.status, (await oRes.text()).substring(0,100));

  } catch(e) {
    console.error(e);
  }
}
test();
