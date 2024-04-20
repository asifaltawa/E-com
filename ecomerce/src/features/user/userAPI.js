export function fetchLoggedInUserOrders(userId) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/orders/'+userId)
    const data = await response.json()
    resolve({data})
});
}
export function fetchLoggedInUserData(userId) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/user/'+userId)
    const data = await response.json()
    resolve({data})
});
}

export function updateAddress(update) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/user/'+update.id,{
      method:'PATCH',
      body: JSON.stringify(update),
      headers:{'content-type':'application/json'}, 
    })
    const data = await response.json()
    resolve({data})
});
}