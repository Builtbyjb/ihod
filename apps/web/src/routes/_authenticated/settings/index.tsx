import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { useLayout } from "@/hooks/useLayout";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import TextInputField from "@/components/Form/TextInputField";
import ImageUploadField from "@/components/Form/ImageUploadField";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import ImagePreview from "@/components/ImagePreview";
import { UserSettingsSchema, UserSchema, BusinessSchema, BusinessSettingsSchema } from "@shared/lib/zod-schema";

type UserSettingType = z.infer<typeof UserSettingsSchema>;

function UserSettings({ settings }: { settings: UserSettingType }) {
  const { doPUT } = useFetch();
  const [avatar, setAvatar] = useState<Blob | string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      avatar: undefined as Blob | undefined,
    } as { username: string; avatar?: Blob | undefined },
    validators: {
      onSubmit: UserSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("username", value.username);
      if (value.avatar) formData.append("avatar", value.avatar);

      try {
        const response = await doPUT("/api/v1/user/settings/profile", formData);
        if (response instanceof Error) throw response;

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        toast.success("User profile updated");
      } catch (error: unknown) {
        if (error instanceof Error) toast.error(error.message);
        console.log(error);
      }
    },
  });

  useEffect(() => {
    (() => {
      if (settings) {
        form.setFieldValue("username", settings.username);
        if (settings.avatarURL) setAvatar(settings.avatarURL);
      }
    })();
  }, [settings, form]);

  return (
    <form
      id="user-settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      onChange={(e) => {
        if (e.target.name === "avatar") setAvatar(e.target.files?.[0]);
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Update your information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImagePreview source={avatar} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field>
              <form.Field
                name="avatar"
                children={(field) => {
                  return (
                    <ImageUploadField
                      field={field}
                      id="picture"
                      label="Profile Picture"
                      description="Select your profile picture. Max size is 5mb"
                    />
                  );
                }}
              />
            </Field>
            <Field>
              <form.Field
                name="username"
                children={(field) => {
                  return (
                    <TextInputField
                      field={field}
                      id="username"
                      label="Username"
                      placeholder="Change what we call you"
                      isRequired={false}
                    />
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

type BusinessSettingsType = z.infer<typeof BusinessSettingsSchema>;

function BusinessSettings({ settings }: { settings: BusinessSettingsType }) {
  const { doPUT } = useFetch();
  const [avatar, setAvatar] = useState<string | Blob | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      website: "",
      address: "",
      city: "",
      country: "",
      logo: undefined as Blob | undefined,
    } as {
      name: string;
      email: string;
      website: string;
      address: string;
      city: string;
      country: string;
      logo?: Blob;
    },
    validators: {
      onSubmit: BusinessSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("email", value.email);
      formData.append("website", value.website);
      formData.append("address", value.address);
      formData.append("city", value.city);
      formData.append("country", value.country);
      if (value.logo) formData.append("logo", value.logo);

      try {
        const response = await doPUT("/api/v1/user/settings/business", formData);
        if (response instanceof Error) throw response;

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        toast.success("Business profile updated");
      } catch (error: unknown) {
        if (error instanceof Error) toast.error(error.message);
        console.log(error);
      }
    },
  });

  useEffect(() => {
    (() => {
      if (settings) {
        form.setFieldValue("name", settings.name);
        form.setFieldValue("email", settings.email);
        // form.setFieldValue("phone", settings.phone);
        if (settings.website) form.setFieldValue("website", settings.website);
        form.setFieldValue("address", settings.address);
        form.setFieldValue("city", settings.city);
        form.setFieldValue("country", settings.country);
        if (settings.logoURL) setAvatar(settings.logoURL);
      }
    })();
  }, [settings, form]);

  return (
    <form
      id="business-settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      onChange={(e) => {
        if (e.target.name === "logo") setAvatar(e.target.files?.[0]);
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>This information will appear on your invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImagePreview source={avatar} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <form.Field
                name="logo"
                children={(field) => {
                  return (
                    <ImageUploadField
                      field={field}
                      id="picture"
                      label="Business Logo"
                      description="Select your logo. Max size is 5mb."
                    />
                  );
                }}
              />
            </Field>
            <Field>
              <form.Field
                name="name"
                children={(field) => {
                  return (
                    <TextInputField
                      field={field}
                      id="name"
                      label="Business Name"
                      placeholder="Your Business Name"
                      isRequired={false}
                    />
                  );
                }}
              />
            </Field>
            <Field>
              <form.Field
                name="email"
                children={(field) => {
                  return (
                    <TextInputField
                      field={field}
                      id="email"
                      label="Business Email"
                      placeholder="contact@business.com"
                      isRequired={false}
                    />
                  );
                }}
              />
            </Field>
            {/*<Field>
              <form.Field
                name="phone"
                children={(field) => {
                  return (
                    <TextInputField
                      field={field}
                      id="phone"
                      label="Phone"
                      placeholder="+1 (555) 123-4567"
                      isRequired={false}
                    />
                  );
                }}
              />
            </Field>*/}
            <Field>
              <form.Field
                name="website"
                children={(field) => {
                  return (
                    <TextInputField
                      field={field}
                      id="website"
                      label="Website"
                      placeholder="https://yourwebsite.com"
                      isRequired={false}
                    />
                  );
                }}
              />
            </Field>
            <Field>
              <form.Field
                name="address"
                children={(field) => {
                  return (
                    <TextInputField
                      field={field}
                      id="address"
                      label="Address"
                      placeholder="Street Address"
                      isRequired={false}
                    />
                  );
                }}
              />
            </Field>
            <Field>
              <form.Field
                name="city"
                children={(field) => {
                  return (
                    <TextInputField
                      field={field}
                      id="city"
                      label="City"
                      placeholder="City, State ZIP"
                      isRequired={false}
                    />
                  );
                }}
              />
            </Field>
            <Field>
              <form.Field
                name="country"
                children={(field) => {
                  return (
                    <TextInputField
                      field={field}
                      id="country"
                      label="Country"
                      placeholder="Country"
                      isRequired={false}
                    />
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

const SettingsSchema = z.object({
  user: UserSettingsSchema,
  business: BusinessSettingsSchema,
});

type SettingsType = z.infer<typeof SettingsSchema>;

function RouteComponent() {
  const { setTitle } = useLayout();
  const [settings, setSettings] = useState<SettingsType>({} as SettingsType);

  const { doGET } = useFetch();

  useEffect(() => {
    setTitle("Settings");
  }, [setTitle]);

  useEffect(() => {
    (async () => {
      try {
        const response = await doGET("/api/v1/user/settings");
        if (response instanceof Error) throw response;

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        const parsedResult = SettingsSchema.parse(result.data);
        setSettings(parsedResult);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        console.error(error);
      }
    })();
  }, [doGET]);

  return (
    <div className="space-y-6 mb-32">
      <UserSettings settings={settings.user} />
      <BusinessSettings settings={settings.business} />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/settings/")({
  component: RouteComponent,
});
