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
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/products/'+id)
    const data = await response.json()
    resolve({data})
});
}

export function createProduct(product){
  return new Promise(async(resolve)=>{
    const response = await fetch('http://localhost:8080/api/v1/products/',{
      method:'POST',
      body: JSON.stringify(product),
      headers:{'content-type':'application/json'}, 
    })
    const data = await response.json();
    resolve({data});
  })
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