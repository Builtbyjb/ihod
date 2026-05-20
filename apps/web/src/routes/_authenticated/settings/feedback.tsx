import { createFileRoute } from "@tanstack/react-router";
import { useLayout } from "@/hooks/useLayout";
import { useEffect } from "react";
import Banner from "@/components/Banner";
import { BadgeInfo } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const FeedbackSchema = z.object({
  subject: z.string(),
  description: z.string(),
});

function RouteComponent() {
  const { setTitle } = useLayout();

  useEffect(() => {
    setTitle("Feedback");
  }, [setTitle]);

  const form = useForm({
    defaultValues: {
      subject: "",
      description: "",
    },
    validators: {
      onSubmit: FeedbackSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <div className="space-y-6">
      <Banner backgroundColor={"bg-sky-100"} icon={<BadgeInfo />} text={"Coming soon!"} />
      <form
        id="feedback-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>Submit issues and feature suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <Field className="space-y-4">
              <form.Field
                name="subject"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor="subject-input">Subject</FieldLabel>
                      <Input
                        id="subject-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Feedback Topic"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor="description-input">Description</FieldLabel>
                      <Textarea
                        id="description-input"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Issues or Suggestion"
                        rows={10}
                        className="min-h-24 resize-none"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </Field>
          </CardContent>
          <CardFooter className="bg-background">
            <Button type="submit" form="feedback-form">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/settings/feedback")({
  component: RouteComponent,
});
