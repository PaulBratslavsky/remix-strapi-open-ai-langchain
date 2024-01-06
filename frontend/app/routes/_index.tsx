import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";

import { generateDescription } from "~/services/generate-description.server";
import { saveDescription } from "~/services/save-description.server";

import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { DescriptionListLoader } from "./resources.videos";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formItems = Object.fromEntries(formData);

  let data: any = null;

  switch (formItems._action) {
    case "generate":
      data = await generateDescription(formItems.videoId as string);
      return json({ data: { description: data, videoId: formItems.videoId } });
    case "save":
      const dataToSave = {
        data: {
          videoId: formItems.videoId,
          description: formItems.description,
        },
      };
      data = await saveDescription(dataToSave);
      return json({ data: null, message: "Saved!" });
    default:
      return json({ data, message: "No action found!" });
  }
}

export default function Index() {
  const formActionData = useActionData<typeof action>();
  const onUpdate = formActionData?.data?.videoId as string;
  return (
    <div>
      <h1>Generate Video Description</h1>
      <div key={onUpdate}>
        <GenerateDescriptionForm />
        <SaveDescriptionForm data={formActionData} />
      </div>
      <DescriptionListLoader />
    </div>
  );
}

function GenerateDescriptionForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.formData?.get("_action") === "generate";

  return (
    <Form method="POST">
      <fieldset
        disabled={isSubmitting}
        className="flex gap-2 items-center justify-center my-4"
      >
        <Input
          name="videoId"
          placeholder="Youtube Video ID or URL"
          className="w-full"
          required
        />
        <Button name="_action" value="generate" type="submit">
          {isSubmitting ? "Generating..." : "Generate Description"}
        </Button>
      </fieldset>
    </Form>
  );
}

function SaveDescriptionForm({ data }: { readonly data: any }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formData?.get("_action") === "save";

  if (!data?.data) return null;
  return (
    <Form method="POST" className="w-full">
      <fieldset disabled={isSubmitting}>
        <Textarea
          name="description"
          className="w-full h-[400px]"
          defaultValue={data?.data.description}
        />
        <input type="hidden" name="videoId" defaultValue={data?.data.videoId} />
        <Button
          name="_action"
          value="save"
          className="float-right my-2"
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save Description"}
        </Button>
      </fieldset>
    </Form>
  );
}
