export async function getWeatherByCoords(lat, lon) {
  console.log('KEY:', import.meta.env.VITE_WEATHERSTACK_API_KEY)

  const accessKey = import.meta.env.VITE_WEATHERSTACK_API_KEY

  const url = `https://api.weatherstack.com/current?access_key=${accessKey}&query=${lat},${lon}`
  
  console.log(url)
  const res = await fetch(url, { method: 'GET' })

  console.log(res)
  const data = await res.json()

  console.log(data)

  return data
}

export async function getWeatherByCity(city) {
  const accessKey = import.meta.env.VITE_WEATHERSTACK_API_KEY
  const url = `https://api.weatherstack.com/current?access_key=${accessKey}&query=${encodeURIComponent(city)}`
  const res = await fetch(url, { method: 'GET' })
  return await res.json()
}