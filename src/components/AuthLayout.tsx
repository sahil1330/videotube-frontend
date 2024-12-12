import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

interface ProtectedProps {
    children: React.ReactNode;
    authentication: boolean;
}

export default function Protected({ children, authentication = true }: ProtectedProps) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authStatus = useSelector((state: any) => state.auth.status);
    useEffect(() => {
        console.log("authStatus: ", authStatus);
        if (authentication && authStatus !== authentication) {
            navigate("/login");
        }
        else if (!authentication && authStatus !== authentication) {
            navigate("/");
        }
        setLoader(false);
    }, [authStatus, navigate, authentication])
    return loader ? <>Loading...</> : <>{children}</>;
}
