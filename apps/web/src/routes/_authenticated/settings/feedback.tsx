import { createFileRoute } from "@tanstack/react-router";
import { useLayout } from "@/hooks/useLayout";
import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TextInputField from "@/components/Form/TextInputField";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import { FeedbackSchema } from "@shared/lib/zod-schema";

type FeedbackSchemaType = z.infer<typeof FeedbackSchema>;

function RouteComponent() {
  const { setTitle } = useLayout();
  const { doPOST } = useFetch();

  useEffect(() => {
    setTitle("Feedback");
  }, [setTitle]);

  const form = useForm({
    defaultValues: {
      subject: "",
      description: "",
    } as FeedbackSchemaType,
    validators: {
      onSubmit: FeedbackSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await doPOST("/api/v1/user/settings/feedback", value);
        if (response instanceof Error) throw response;

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        toast.success("Feedback submitted!");
        form.reset();
      } catch (error: unknown) {
        if (error instanceof Error) toast.error(error.message);
        console.log(error);
      }
    },
  });

  return (
    <div className="space-y-6">
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
                  return (
                    <TextInputField
                      field={field}
                      id="subject-input"
                      label="Subject"
                      placeholder="Feedback Topic"
                      isRequired={false}
                    />
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
