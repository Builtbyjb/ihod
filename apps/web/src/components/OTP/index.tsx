import { useState } from "react";
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

export default function OTP() {
  const [value, setValue] = useState("");

  const handleChange = (value: string) => {
    setValue(value);
    if (value.length == 8) {
      console.log(value);
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
