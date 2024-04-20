export function addToCart(item) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/cart',{
      method:'POST',
      body: JSON.stringify(item),
      headers:{'content-type':'application/json'}, 
    })
    const data = await response.json()
    resolve({data})
});
}

export function fetchCartById(userId) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/cart?user='+userId)
    const data = await response.json()
    resolve({data})
});
}


export function updateCart(update) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/cart/'+update.id,{
      method:'PATCH',
      body: JSON.stringify(update),
      headers:{'content-type':'application/json'}, 
    })
    const data = await response.json()
    resolve({data})
});
}

export function DeleteCart(itemId) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/cart/'+itemId,{
      method:'DELETE',
      headers:{'content-type':'application/json'}, 
    })
    const data = await response.json()
    resolve({data:{id:itemId}})
});
}

export function resetCart(userId){
  return new Promise(async(resolve)=>{
    const response = await fetchCartById(userId);
    const items = response.data
    for(let item of items ){
      await DeleteCart(item.id);
    }
    resolve({status:'success'})
  })
}