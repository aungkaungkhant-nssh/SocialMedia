import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTweet, postNoti, putLike } from "../apiCall";
import { io } from "socket.io-client";

var socket;
socket = io("http://localhost:8000")



const appSlice = createSlice({
    name:"app",
    initialState:{
        count:0,
        page:0,
        total:0,
        tweets:[],
        status:"idle",
        hasMore:false,
        notis:[]
    },
    reducers:{
        setNoti:(state,action)=>{
            state.notis = action.payload
        },
        addNoti:(state,action)=>{
           
            state.notis = [action.payload,...state.notis]
        },
        oneNotiRead:(state,action)=>{
            state.notis = state.notis.map((noti)=>{
                    if(noti._id === action.payload.id){
                        noti.read = true
                    }
                    return noti
            })
        },
        markAllNotiRead:(state,action)=>{
            state.notis = state.notis.map((noti) => {
                noti.read = true;
                return noti
            })
        },
        removeNoti:(state,action)=>{
            state.notis= state.notis.filter((noti)=>noti._id !== action.payload._id)
        },
        addTweet:(state,action)=>{
            state.tweets = [action.payload,...state.tweets]
        },

        
        addComment:(state,action)=>{
             postNoti({target:action.payload.id,type:"comment"})
             .then((res)=>{
                socket.emit("sendNoti",res)
             })
              state.tweets  = state.tweets.map((t)=>{
                if(t._id== action.payload.id){
              
                    t.comments =[...t.comments,... action.payload.res]
                }
                
                return t
              })

        },
        removeTweet:(state,action)=>{
            const rmTweet = state.tweets.find((t)=>t._id === action.payload._id);
         
            if(rmTweet.type === "comment"){
                state.tweets =  state.tweets.map((t)=>{
                    if(t.comments){
                        t.comments = t.comments.filter((c)=>c._id !== rmTweet._id)
                    }
                  
                    return t
                })
               
                return
            }
         
            state.tweets = state.tweets.filter((t)=>t._id!==action.payload._id)
        },
        toggleLike:(state,action)=>{
      
             putLike({id:action.payload.target})
             .then((likes)=>{
                    if(likes.includes(action.payload.actor)){
                         postNoti({target:action.payload.target,type:"like"})
                        .then((res)=>{
                            if(res.length===0)return
                            socket.emit("sendNoti",res)
                        })
                    }
             });
            
            state.tweets = state.tweets.map((tweet)=>{
              
                if(tweet._id === action.payload.target){
                    if(tweet.likes.includes(action.payload.actor)){
                        tweet.likes = tweet.likes.filter((t)=>t!==action.payload.actor)
                    }else{
                    
                        tweet.likes.push(action.payload.actor);
                      
                    }
                }else{
                    tweet.comments = tweet.comments.map((t)=>{
                        if(t._id === action.payload.target){
              
                            if(t.likes.includes(action.payload.actor)){
                                t.likes = t.likes.filter((t)=>t!==action.payload.actor)
                            }else{
                            
                                t.likes.push(action.payload.actor);
                                
                            }
                          
                        }
                        return t
                    })
                   
           
                }
                return tweet;
            })
            
        },
        setTweets:(state,action)=>{
            state.tweets = [...action.payload.tweets];
            state.count = action.payload.count;
            state.page = action.payload.page;
            state.total = action.payload.total;
            state.hasMore =action.payload.hasMore
        }
    },
    extraReducers:builder=>{
        builder
        .addCase(fetchSingle.pending,(state)=>{
            state.status = "loading"
        })
        .addCase(fetchSingle.fulfilled,(state,action)=>{
            state.status = "idle";
        
            if(!state.tweets.find((t)=>t._id == action.payload._id)){
          
                state.tweets=[action.payload,...state.tweets];
            }
        })
       
    }
})




export const fetchSingle = createAsyncThunk("app/fetchSingle",async({id})=>{
    let result = await fetchTweet(id);
    return result;
})


export const {addTweet,addComment,removeTweet,toggleLike,setNoti,addNoti,removeNoti,oneNotiRead,markAllNotiRead,setTweets} = appSlice.actions;
export default appSlice.reducer;