export function CreateOrder(order) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/orders',{
      method:'POST',
      body: JSON.stringify(order),
      headers:{'content-type':'application/json'}, 
    })
    const data = await response.json()
    resolve({data})
});
}

export function fetchAllOrders(sort, pagination) {
  let queryString = '';
 
  for (let key in sort) {
   queryString += `${key}=${sort[key]}&`;
 }
   for (let key in pagination) {
     queryString += `${key}=${pagination[key]}&`;
   }
 
   return new Promise(async (resolve) => {
     //TODO: we will not hard-code server URL here
     const response = await fetch(
       'http://localhost:8080/api/v1/orders?' + queryString
     );
     const data = await response.json();
    //  pagination me x-total-count header me nahi aa rha hi
     const totalOrders = await response.headers.get('X-Total-Count');
     resolve({ data: { orders: data, totalOrders: +totalOrders } });
   });
 }

export function updateOrder(update) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/orders/'+update.id,{
      method:'PATCH',
      body: JSON.stringify(update),
      headers:{'content-type':'application/json'}, 
    })
    const data = await response.json()
    resolve({data})
});
}