export function fetchLoggedInUserOrders(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/orders/'+userId, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      resolve({data});
    } catch (error) {
      console.error('Error fetching user orders:', error);
      // Instead of rejecting, resolve with empty orders to prevent app crashes
      resolve({data: []});
    }
  });
}

export function fetchLoggedInUserData(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/user/'+userId, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      resolve({data});
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Instead of rejecting, resolve with empty user data to prevent app crashes
      resolve({data: {}});
    }
  });
}

export function updateAddress(update) {
  return new Promise(async (resolve, reject) =>{
    try {
      // Check if user ID exists
      if (!update || !update.id) {
        console.error('User ID is undefined or missing');
        reject({ error: 'User ID is required for updating address' });
        return;
      }
      
      const response = await fetch('http://localhost:8080/api/v1/user/'+update.id,{
        method:'PATCH',
        body: JSON.stringify(update),
        headers:{'content-type':'application/json'}, 
      });
      
      const data = await response.json();
      resolve({data});
    } catch (error) {
      console.error('Error updating address:', error);
      reject(error);
    }
  });
}