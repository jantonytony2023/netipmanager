const API_URL = 'https://organic-invention-5gq9r5gqwvw4fqpv-3000.app.github.dev';

async function create(resource, data) {
  const res = await fetch(`${API_URL}/${resource}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify(data),
  });
  return await res.json();
}

async function read(resource) {
  const res = await fetch(`${API_URL}/${resource}`);
  return await res.json();
}

async function update(resource, data) {
  const res = await fetch(`${API_URL}/${resource}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'put',
    body: JSON.stringify(data),
  });
  return await res.json();
}

async function remove(resource) {
  const res = await fetch(`${API_URL}/${resource}`, { method: 'delete' });
  return res.ok;
}

export default { create, read, update, remove };