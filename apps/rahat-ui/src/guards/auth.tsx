import { useAuthStore } from "@rahat-ui/query/auth"


interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard = ({children}:AuthGuardProps) => {
  const {token} = useAuthStore()
  console.log('token', token)


  if(token){
    return children
  }



    
  return children
}

export default AuthGuard