let token = "";

 function setToken(newtoken:string){
    token = newtoken;
}
 function getToken(){
    return token;
}
 function clearToken(){
    token = "";
}

let logoutcallback : (()=>void)|null = null;

function registerLogout(cb:any){
    logoutcallback = cb;
}
function triggerLogout(){
    if(logoutcallback) logoutcallback();
}
export default {setToken,getToken,clearToken,triggerLogout,registerLogout}