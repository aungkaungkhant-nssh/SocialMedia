import axios from 'axios'
const apiBase = "http://localhost:8000/api"

export function getToken (){
    return localStorage.getItem("token") || false;
}

export const userRegister = async(data)=>{
    try{
        let res = await axios.post(`${apiBase}/user/register`,data);
        localStorage.setItem("token",res.data.token)
        return res.data
    }catch(err){
        if(err.response.status===402) return 402;
        return 500;
    }
}   
export const userLogin = async (data)=>{
    try{
        let res = await axios.post(`${apiBase}/user/login`,data);
        localStorage.setItem("token",res.data.token);
        return res.data;
    }catch(err){
        if(err.response.status===403) return 403;
        return 500;
    }
}

export const fetchUser = async()=>{
    const token = getToken();
    if(!token) return false;
    try{
        let res = await axios.get(`${apiBase}/user`,{
           headers:{
            Authorization:`Bearer ${token}`
           }
        })

        return res.data
    }catch(err){
        
        return false
    }
}

export const postTweet = async(data)=>{
    const token  = getToken();
    try{
        let res= await axios.post(`${apiBase}/tweet`,data,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data;
    }catch(err){
        return err.response
    }
}

export const fetchTweets = async(page)=>{
    try{
        let res = await axios.get(`${apiBase}/tweet?page=${page}`);
        return res.data
    }catch(err){
        return false
    }
}
export const fetchTweet = async(id)=>{
    try{
        let res = await axios.get(`${apiBase}/tweet/${id}`);
        
        return res.data;
    }catch(err){
        return false
    }
}

export const destroyTweet = async({id})=>{
    const token = getToken();
  
    try{
        let res = await axios.delete(`${apiBase}/tweet/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data
    }catch(err){
        return false
    }
}

export const putLike = async({id})=>{
    const token = getToken();
    try{
        let res = await axios.put(`${apiBase}/tweet/${id}/like`,{id},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data;
    }catch(err){
        return false
    }
}

export const addNewReply = async(data)=>{
    const token = getToken();
    try{
        let res =await axios.post(`${apiBase}/tweet/${data.id}/reply`,data,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data
    }catch(err){
        return false
    }
}

export const userSearch  = async(data)=>{
    try{
        let res = await axios.post(`${apiBase}/user/search`,data)
        return res.data
    }catch(err){
        return false
    }
}

export const fetchUserByHandle = async(data)=>{
    try{
        let res = await axios.get(`${apiBase}/user/${data.handle}`)
        return res.data
    }catch(err){
        return false
    }
}

export const putFollow = async(data)=>{
    const token = getToken();
    try{
        let res = await axios.put(`${apiBase}/user/${data.targetId}/follow`,{},
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )
        return res.data
    }catch(err){
        return false
    }
}

export const updateProfile = async(data)=>{
    const token = getToken();
    try{
        let res = await axios.put(`${apiBase}/user/${data.id}/profile`,data,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data
    }catch(err){
        return false
    }
}

export const shareTweet = async(data)=>{
    const token = getToken()
    try{
        let res = await axios.post(`${apiBase}/tweet/${data.id}/share`,data,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data
    }catch(err){
        return false
    }
}  

export const fetchTweetByHandle = async(data)=>{
    try{
        let res =await axios.get(`${apiBase}/tweet/user/${data.handle}?page=${data?.page || 0}`)
        return res.data
    }catch(err){
        return false
    }
}

export const fetchCommentByHandle = async(data)=>{
    try{
        let res  = await axios.get(`${apiBase}/tweet/comment/${data.handle}?page=${data?.page || 0}`)
        return res.data
    }catch(err){
        return false
    }
}

export const fetchLikeByHandle = async(data)=>{
    try{
        let res  = await axios.get(`${apiBase}/tweet/like/${data.handle}?page=${data?.page || 0}`)
        return res.data
    }catch(err){
        return false
    }
}

export const postNoti = async(data)=>{
    const token = getToken()
    try{
        let res = await axios.post(`${apiBase}/noti`,data,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data
    }catch(err){
        return false
    }
}

export const fetchNoti = async()=>{
    const token = getToken();
    try{
        let res = await axios.get(`${apiBase}/noti`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data
    }catch(err){
        return false
    }
}

export const putMarkOneNotiRead = async(data)=>{
    const token = getToken();
    try{
        let res = await axios.put(`${apiBase}/noti/${data.id}`,{},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data
    }catch(err){
        return false
    }
}

export const putMarkAllNotiRead = async(data)=>{
    const token = getToken();
    try{
        let res = await axios.put(`${apiBase}/noti`,{},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data
    }catch(err){
        return false
    }
}

export const deleteNoti = async(data)=>{
    const token = getToken();
    try{
        let res = await axios.delete(`${apiBase}/noti/${data.id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return res.data
    }catch(err){
        return false
    }
}

export const fetchLikes = async(data)=>{
    try{
        let res = await axios.get(`${apiBase}/tweet/${data.id}`);
      
        return res.data.likes_users;
    }catch(err){
        return false
    }
}

export const fetchShares = async(data)=>{
    try{
        let res = await axios.get(`${apiBase}/tweet/${data.id}`)
        return res.data.shares
    }catch(err){
        return false
    }
}
