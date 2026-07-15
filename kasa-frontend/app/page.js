export default async function Page() {
  const data = await fetch('http://localhost:3000/api/properties')
  const properties = await data.json()
  return (
    <ul>
      {properties.map((property) => (
        <li key={property.id}>
          {property.title},
          {property.description},
          {property.cover},
          {property.location},
          {property.price_per_night}
          </li>
      ))}
    </ul>
  )
}