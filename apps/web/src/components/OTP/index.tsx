import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";

export default function OTP() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();

  const handleChange = async (value: string) => {
    setValue(value);
    if (value.length == 8) {
      try {
        const response = await verifyOtp(value);
        if (response) navigate({ to: "/dashboard" });
      } catch (error) {
        toast.error("Error verifying OTP: " + error.message);
        console.error(error);
      }
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Enter OTP</CardTitle>
        <CardDescription>
          Please enter the OTP code sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InputOTP maxLength={8} value={value} onChange={(e) => handleChange(e)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
        </InputOTP>
      </CardContent>
    </Card>
  );
}
