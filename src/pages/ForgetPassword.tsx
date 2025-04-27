/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { useState } from "react";
import { useNavigate } from "react-router";

function ForgetPassword() {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendCode = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        "/users/send-forget-password-code",
        {
          email,
        }
      );
      if (response.data.success) {
        setIsCodeSent(true);
        toast({
          title: response.data.message,
          description: "Please check your email for the verification code.",
        });
      }
    } catch (error) {
      const errorMessage = geterrorMessage((error as any).response.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        "/users/check-forget-password-code",
        {
          email,
          code,
        }
      );
      if (response.data.success) {
        setIsCodeVerified(true);
        toast({
          title: response.data.message,
        });
      }
    } catch (error) {
      const errorMessage = geterrorMessage((error as any).response.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setIsSubmitting(true);
    try {
      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      const response = await axiosInstance.post("/users/create-new-password", {
        email,
        password: newPassword,
      });
      if (response.data.success) {
        setIsPasswordReset(true);
        toast({
          title: response.data.message,
        });
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    } catch (error) {
      const errorMessage = geterrorMessage((error as any).response.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-10 p-4">
      {!isCodeSent && (
        <div className="mb-4 text-2xl font-bold w-1/2 text-center">
          <h2 className="text-xl text-primary py-4">
            Enter your Email for verification Code
          </h2>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isCodeSent || isCodeVerified || isPasswordReset}
            className="mb-4"
          />
          {isSubmitting ? (
            <Button onClick={handleSendCode}>Send Code ...</Button>
          ) : (
            <Button
              onClick={handleSendCode}
              disabled={!email}
              className="mb-4 text-secondary-foreground"
            >
              Send Code
            </Button>
          )}
        </div>
      )}

      {isCodeSent && !isCodeVerified && (
        <div className="mb-4 text-2xl font-bold w-1/2 text-center">
          <h2 className="text-xl text-primary py-4">
            Enter the verification code sent to your email
          </h2>
          <Input
            type="text"
            placeholder="Enter the verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={handleVerifyCode}
            disabled={isSubmitting || !code}
            className="mb-4 text-secondary-foreground"
          >
            {isSubmitting ? "Verifying ..." : "Verify Code"}
          </Button>
        </div>
      )}

      {isCodeVerified && !isPasswordReset && (
        <div className="mb-4 text-2xl font-bold w-1/2 text-center">
          <h2 className="text-xl text-primary py-4">Enter your new password</h2>
          <Input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={handleResetPassword}
            disabled={isSubmitting || !newPassword || !confirmPassword}
            className="mb-4 text-secondary-foreground"
          >
            {isSubmitting ? "Resetting ..." : "Reset Password"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
