import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import OTP from "@/components/OTP";
import { CURRENCIES } from "@/lib/store";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  username: z.string().min(2),
  businessName: z.string().min(2),
  businessType: z.string().min(2),
  currency: z.string().min(2),
  businessAddress: z.string().min(2),
  city: z.string().min(2),
  country: z.string().min(2),
  website: z.string(),
});

const API_URL = import.meta.env.VITE_API_URL;

function RouteComponent() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      businessName: "",
      businessType: "",
      currency: "",
      businessAddress: "",
      city: "",
      country: "",
      website: "",
    },
    validators: {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ArrowLeft className="mb-8 w-12 h-12 hover:scale-110" onClick={() => navigate({ to: "/" })} />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Tell us about yourself and your business</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <Field orientation="horizontal">
                <form.Field
                  name="firstname"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="first-name-input">
                          First Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          required
                          id="first-name-input"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="lastname"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="last-name-input">
                          Last Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          required
                          id="last-name-input"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
              </Field>
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
                        autoComplete="off"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="username"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="username-input">
                        What should we call you? <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        required
                        id="username-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="businessName"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="business-name-input">
                        Business Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        required
                        id="business-name-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="businessType"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="business-type-input">
                        Business Type <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        required
                        id="business-type-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="website"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="website-input">Website</FieldLabel>
                      <Input
                        id="website-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        placeholder="https://www.examplebusiness.com"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="currency"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="currency-input">
                        Preferred Currency <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={CURRENCIES.find((c) => c.value === field.state.value)?.name}
                        onValueChange={(e) => {
                          if (e) field.handleChange(e);
                        }}
                      >
                        <SelectTrigger id="select-currency" aria-invalid={isInvalid} className="min-w-30">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {/*<SelectItem value="auto">Auto</SelectItem>*/}
                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="businessAddress"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="business-address-input">
                        Business Address <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        required
                        id="business-address-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Street Address"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              <Field orientation="horizontal">
                <form.Field
                  name="city"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="business-city-input">
                          City <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          required
                          id="business-city-input"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="City, State ZIP"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="country"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="business-address-input">
                          Country <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          required
                          id="business-address-input"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Country"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="bg-background">
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="signup-form">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 mt-4">
        By clicking Submit, you agree to our <Link to="/terms-of-service">Terms of Service</Link> and{" "}
        <Link to="/privacy-policy">Privacy Policy</Link>.
      </div>
      <br />
      <br />
      {isVerified && <OTP />}
    </div>
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
