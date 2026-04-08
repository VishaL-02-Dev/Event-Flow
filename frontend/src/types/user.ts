export interface User{
    _id:string;
    name:string;
    email:string;
    isAdmin:boolean;
}


export interface AuthResponse{
    message:string;
    token:string;
    user:User
}