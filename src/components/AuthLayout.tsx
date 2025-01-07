import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

interface ProtectedProps {
    children: React.ReactNode;
    authentication: boolean;
    url: string;
}

export default function Protected({ children, authentication = true, url }: ProtectedProps) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authStatus = useSelector((state: any) => state.auth.status);
    useEffect(() => {
        // console.log("authStatus: ", authStatus);
        if (authentication && authStatus !== authentication) {
            navigate("/login")
        }
        else if (!authentication && authStatus !== authentication) {
            navigate(url)
        }
        
        setLoader(false);
    }, [authStatus, navigate, authentication, url])
    return loader ? <>Loading...</> : <>{children}</>;
}
