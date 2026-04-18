import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export default function OTP() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleChange = async (value: string) => {
    setValue(value);
    if (value.length == 8) {
      try {
        console.log(value);
        const response = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: value }),
        });
        if (!response.ok) {
          throw new Error("Failed to verify OTP");
        }
        const data = await response.json();
        if (data.firstLogin) {
          navigate({ to: "/setup-profile" });
        } else {
          navigate({ to: "/dashboard" });
        }
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
