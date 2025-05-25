const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

export async function postFavorito(ciudad) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ciudad })
    })
    if (!res.ok) throw new Error('Error al guardar favorito')
    return await res.json()
  } catch (e) {
    throw e
  }
}

export async function deleteFavorito(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Error al eliminar favorito')
    return true
  } catch (e) {
    throw e
  }
}