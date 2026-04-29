import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldGroup } from "@/components/ui/field";
import { useState } from "react";
import OTP from "@/components/OTP";
import { ArrowLeft } from "lucide-react";
import Step1 from "@/components/SignupFormSteps/step1";
import Step2 from "@/components/SignupFormSteps/step2";
import Step3 from "@/components/SignupFormSteps/step3";
import { STEPS } from "@/components/SignupFormSteps/form-steps";
import { Progress } from "@/components/ui/progress";

const schema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  username: z.string().min(2),
  businessName: z.string().min(2),
  businessType: z.string().min(2),
  businessAddress: z.string().min(2),
  city: z.string().min(2),
  country: z.string().min(2),
  website: z.string(),
});

const API_URL = import.meta.env.VITE_API_URL;

function RouteComponent() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      businessName: "",
      businessType: "",
      businessAddress: "",
      city: "",
      country: "",
      website: "",
    },
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (!response.ok) throw new Error("Error setting profile");

        setIsVerified(true);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    },
  });

  const next = async () => {
    // Validate only the current step's fields before advancing
    const fields = STEPS[stepIndex].fields;
    const results = await Promise.all(fields.map((field) => form.validateField(field, "change")));
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
      <br />
      <br />
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
