import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ArrowLeft } from "lucide-react";
import OTP from "@/components/OTP";
import { useAuth } from "@/auth";

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
        if (success) {
          console.log(value.email);
          setIsVerified(true);
        }
      } catch (error) {
        toast.error("Login failed: " + error.message);
        console.error(error);
      }
      toast.success("Verification email sent");
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ArrowLeft
        className="mb-8 w-12 h-12 hover:scale-110"
        onClick={() => navigate({ to: "/" })}
      />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
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
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="email-input">Email</FieldLabel>
                      <Input
                        required
                        id="email-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        // placeholder="Enter your email"
                        autoComplete="email"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="bg-background">
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="login-form">
              Save
            </Button>
          </Field>
        </CardFooter>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 mt-4">
        By clicking continue, you agree to our{" "}
        <Link to="/terms-of-service">Terms of Service</Link> and{" "}
        <Link to="/privacy-policy">Privacy Policy</Link>.
      </div>
      <br />
      <br />
      {isVerified && <OTP />}
    </div>
  );
}

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});
