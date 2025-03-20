// Define the API base URL
const API_URL = 'http://localhost:8080/api/v1';

export function fetchallproducts() {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/products')
    const data = await response.json()
    resolve({data})
});
}
export function fetchProductsByFilters(filter,sort,pagination,admin) {
  let queryString = '';
  for(let key in filter){
    const categoryValues = filter[key];
    if(categoryValues.length){
      const lastValue = categoryValues[categoryValues.length-1]
      queryString += `${key}=${lastValue}&`
    }
  }
  for(let key in sort){
    queryString += `${key}=${sort[key]}&`
  }
  console.log(pagination)
   for(let key in pagination){
     queryString += `${key}=${pagination[key]}&`
   }
   if(admin){
    queryString += `admin=true`
   }
  console.log(queryString);
  return new Promise(async(resolve)=>{
    const response = await fetch('http://localhost:8080/api/v1/products?'+queryString) 
    const data = await response.json()
    const totalItems = response.headers.get('X-Total-Count')
    resolve({data:{products:data,totalItems:+totalItems}})
  });
}
export function fetchfiltersCategories() {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/categories')
    const data = await response.json()
    resolve({data})
});
}
export function fetchfiltersBrands() {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/brands')
    const data = await response.json()
    resolve({data})
});
}

export function fetchProductsById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the ID is a valid MongoDB ObjectId or a numeric ID
      if (!/^[0-9a-fA-F]{24}$/.test(id) && isNaN(parseInt(id))) {
        throw new Error(`The product ID "${id}" is not valid. Please check the URL and try again.`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('http://localhost:8080/api/v1/products/'+id, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) {
          throw new Error('Product not found. Please check the URL and try again.');
        }
        throw new Error(errorData.message || `Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data) {
        console.warn('No product data received');
        throw new Error('No product data received');
      }
      
      if (!data.id) {
        console.warn('Product data is missing ID:', data);
        throw new Error('Product data is invalid or incomplete');
      }
      
      console.log('Product fetched successfully:', data.id, data.title);
      resolve({data});
    } catch (error) {
      console.error('Error fetching product:', error.name, error.message);
      
      if (error.name === 'AbortError') {
        reject(new Error('Request timed out. Please try again later.'));
      } else {
        reject(error);
      }
    }
  });
}

export async function createProduct(product) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
      headers: { 'content-type': 'application/json' },
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Check for duplicate title error in different possible error formats
      if (data && 
          ((data.errmsg && data.errmsg.includes && data.errmsg.includes('duplicate key')) ||
           (data.error && data.error.includes && data.error.includes('duplicate key')) ||
           (data.message && data.message.includes && data.message.includes('duplicate')))) {
        throw new Error(`A product with the title "${product.title}" already exists. Please use a different title.`);
      }
      throw new Error(data?.message || 'Failed to create product');
    }
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export function updateProduct(update){
  return new Promise(async(resolve)=>{
    const response = await fetch('http://localhost:8080/api/v1/products/'+update.id,{
      method:'PATCH',
      body: JSON.stringify(update),
      headers:{'content-type':'application/json'}, 
    })
    const data = await response.json();
    resolve({data});
  })
}