export function createUser(userData) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/api/v1/signup',{
      method:'POST',
      body: JSON.stringify(userData),
      headers:{'content-type':'application/json'}, 
    })
    const data = await response.json()
    resolve({data})
});
}

export function checkuser(loginInfo) {
  return new Promise(async (resolve,reject) =>{
    try{
      const response = await fetch('http://localhost:8080/api/v1/login',{
        method:'POST',
        body: JSON.stringify(loginInfo),
        headers:{'content-type':'application/json'}, 
      } )
      if(response.ok){
        const data = await response.json()
        console.log({data})
        resolve({data});
      }
      else{
        const error = await response.json()
        reject(error)
      }
    }
    catch(error){
      
      reject(error)
    }
});
}


export function signOut(userId) {
  return new Promise(async (resolve) =>{
    
  //TODO:  we will do this in backedn
    resolve({data:"success"})
});
}
