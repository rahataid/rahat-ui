import { useAuthStore } from "../store/auth"




const AuthGuard = ({children}) => {
  const {token} = useAuthStore()


  if(token){
    return children
  }



    
  return children
}

export default AuthGuard