import { useAuth } from '@/context/AuthContext';
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function withAuth(WrappedComponent) {
  const Router = useRouter();
  const { isLoggedIn } = useAuth();

  
  return (props) => {


    useEffect(() => {
      if (!isLoggedIn) {
        Router.replace("/auth/login");
      }
    }, [isLoggedIn]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };
}