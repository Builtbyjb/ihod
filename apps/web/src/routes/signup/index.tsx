import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Field, FieldGroup } from "@/components/ui/field";
import { useState } from "react";
import OTP from "@/components/OTP";
import { ArrowLeft } from "lucide-react";
import Step1 from "@/components/SignupFormSteps/step1";
import Step2 from "@/components/SignupFormSteps/step2";
import Step3 from "@/components/SignupFormSteps/step3";
import { STEPS } from "@/components/SignupFormSteps/form-steps";
import { Progress } from "@/components/ui/progress";
import { useSignupForm } from "@/hooks/useSignupForm";
import type { SignupFormField } from "@/lib/types";
import { useFetch } from "@/hooks/useFetch";

function RouteComponent() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  const { doPOST } = useFetch();
  const navigate = useNavigate();

  const form = useSignupForm(async (value) => {
    try {
      const response = await doPOST("/api/v1/auth/signup", value);
      if (response instanceof Error) throw response;

      if (!response.ok) throw new Error("Error setting profile");

      setIsVerified(true);
      toast.success("Verification Email Sent");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        toast.error(error.message);
      } else {
        console.log(String(error));
      }
    }
  });

  const next = async () => {
    // Validate only the current step's fields before advancing
    const fields = STEPS[stepIndex].fields;
    const results = await Promise.all(fields.map((field: SignupFormField) => form.validateField(field, "change")));
    const hasErrors = results.some((r) => r.length > 0);
    if (!hasErrors) setStepIndex((i) => i + 1);
  };

  const back = () => setStepIndex((i) => i - 1);

  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen mx-auto w-[90%] mt-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-6 mb-2">
            <ArrowLeft className="w-8 h-8 hover:scale-110" onClick={() => navigate({ to: "/" })} />
            <CardTitle className="text-xl">Sign Up</CardTitle>
          </div>
          <CardDescription>Tell us about yourself and your business</CardDescription>
          <Progress value={progress} className="h-1" />
        </CardHeader>
        <CardContent>
          <form
            id="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (isLastStep) form.handleSubmit();
              else next();
            }}
          >
            <FieldGroup>
              {stepIndex === 0 && <Step1 form={form} />}
              {stepIndex === 1 && <Step2 form={form} />}
              {stepIndex === 2 && <Step3 form={form} />}
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="bg-background">
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={back} disabled={stepIndex === 0}>
              Back
            </Button>
            <Button type="submit" form="signup-form">
              {isLastStep ? "Submit" : "Continue"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
      <div className="text-center text-xs mt-4">
        By clicking Submit, you agree to our{" "}
        <Link to="/terms-of-service" className="hover:font-bold underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy-policy" className="hover:font-bold underline">
          Privacy Policy
        </Link>
        .
      </div>
      {isVerified && (
        <p className="text-sm mt-4  mb-4 text-gray-700">
          If you don’t see it in your inbox, please check your spam folder.
        </p>
      )}
      {isVerified && <OTP />}
    </main>
  );
}

export const Route = createFileRoute("/signup/")({
  beforeLoad: async ({ context }) => {
    const isAuthenticated: boolean = context.auth ? await context.auth.authenticate() : false;
    if (isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: RouteComponent,
});
