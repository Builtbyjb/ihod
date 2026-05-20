import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLayout } from "@/hooks/useLayout";
import { useEffect } from "react";
import Banner from "@/components/Banner";
import { BadgeInfo } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

const UserSchema = z.object({
  username: z.string(),
});

function UserSettings() {
  const form = useForm({
    defaultValues: {
      username: "",
    },
    validators: {
      onSubmit: UserSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      id="user-settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Update your information</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Field>
              <form.Field
                name="username"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="username-input">Username</FieldLabel>
                      <Input
                        id="username-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Change what we call you"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </Field>
          </div>
        </CardContent>
        <CardFooter className="bg-background">
          <Button type="submit" form="user-settings-form">
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

const BusinessSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  website: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
});

function BusinessSettings() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      country: "",
    },
    validators: {
      onSubmit: BusinessSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      id="business-settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>This information will appear on your invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="name-input">Business Name</FieldLabel>
                      <Input
                        required
                        id="name-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Your Business Name"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </Field>
            <Field>
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="email-input">Business Email</FieldLabel>
                      <Input
                        required
                        id="email-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="contact@business.com"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <form.Field
                name="phone"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="phone-input">Phone</FieldLabel>
                      <Input
                        required
                        id="phone-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="+1 (555) 123-4567"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </Field>
            <Field>
              <form.Field
                name="website"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="website-input">Website</FieldLabel>
                      <Input
                        required
                        id="website-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="https://yourwebsite.com"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field>
              <form.Field
                name="address"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="address-input">Address</FieldLabel>
                      <Input
                        required
                        id="address-input"
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
            </Field>
            <Field>
              <form.Field
                name="city"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="city-input">City</FieldLabel>
                      <Input
                        required
                        id="city-input"
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
            </Field>
            <Field>
              <form.Field
                name="country"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="country-input">Country</FieldLabel>
                      <Input
                        required
                        id="country-input"
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
          </div>
        </CardContent>
        <CardFooter className="bg-background">
          <Button type="submit" form="business-settings-form">
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function RouteComponent() {
  const { setTitle } = useLayout();

  useEffect(() => {
    setTitle("Settings");
  }, [setTitle]);

  return (
    <div className="space-y-6">
      <Banner backgroundColor={"bg-sky-100"} icon={<BadgeInfo />} text="Coming soon!" />
      <UserSettings />
      <BusinessSettings />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/settings/")({
  component: RouteComponent,
});
