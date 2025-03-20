export function CreateOrder(order) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/orders', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
          'content-type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        reject({
          message: data.message || 'Failed to create order'
        });
        return;
      }
      
      resolve({ data });
    } catch (error) {
      reject({
        message: 'Unable to connect to the server'
      });
    }
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
 
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/v1/orders?' + queryString,
        {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      const totalOrders = response.headers.get('X-Total-Count') || '0';
      
      // Ensure orders is always an array
      const orders = Array.isArray(data) ? data : [];
      
      resolve({ data: { orders: orders, totalOrders: +totalOrders } });
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return empty array on error
      resolve({ data: { orders: [], totalOrders: 0 } });
    }
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