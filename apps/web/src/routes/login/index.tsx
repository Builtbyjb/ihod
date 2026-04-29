import { useState } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ArrowLeft } from "lucide-react";
import OTP from "@/components/OTP";
import { useAuth } from "@/hooks/auth";

const emailFormSchema = z.object({
  email: z.string().email(),
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: emailFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const success = await login(value.email);
        toast.success("Verification email sent");
        if (success) setIsVerified(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error("Login failed: " + error.message);
          console.error(error);
        } else {
          console.log(String(error));
        }
      }
    },
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen mx-auto w-[90%]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex gap-6 items-center mb-2">
            <ArrowLeft className="w-8 h-8 hover:scale-110" onClick={() => navigate({ to: "/" })} />
            <CardTitle className="text-xl">Login</CardTitle>
          </div>
          <CardDescription>Login with your email</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="email-input">
                        Email <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        required
                        id="email-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="email"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="bg-background">
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="login-form">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
      <div className="text-center text-xs text-muted-foreground w-full mt-4">
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
      {/* Display OTP input */}
      {isVerified && <OTP />}
    </main>
  );
}

export const Route = createFileRoute("/login/")({
  beforeLoad: async ({ context }) => {
    const isAuthenticated = context.auth ? await context.auth.authenticate() : false;
    if (isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: RouteComponent,
});
