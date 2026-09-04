"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import type { ProjectVisibility } from "@/types";

interface Errors {
  name?: string;
  description?: string;
}

export function NewProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<ProjectVisibility>("team");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setDescription("");
    setVisibility("team");
    setErrors({});
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const next: Errors = {};
    if (!name.trim()) next.name = "Give the project a name.";
    if (description.trim().length < 10) {
      next.description = "Describe the project in a sentence or two.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    // No persistence layer yet — the form is complete, the write is not.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);

    toast({
      variant: "info",
      title: "Nothing was saved",
      description:
        "The form works end to end, but projects need a backend to persist. Connect one and this call becomes POST /v1/projects.",
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a project"
      description="Projects group conversations, members and budgets so spend has an owner."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button form="new-project-form" type="submit" loading={submitting}>
            Create project
          </Button>
        </>
      }
    >
      <form id="new-project-form" onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Project name" error={errors.name} required>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              value={name}
              invalid={invalid}
              aria-describedby={describedBy}
              placeholder="Atlas Support Copilot"
              onChange={(event) => setName(event.target.value)}
            />
          )}
        </Field>

        <Field
          label="Description"
          error={errors.description}
          hint="What is this project for, and who is it for?"
          required
        >
          {({ id, describedBy, invalid }) => (
            <Textarea
              id={id}
              value={description}
              invalid={invalid}
              aria-describedby={describedBy}
              placeholder="Customer-facing assistant for tier-1 support, grounded on the help centre."
              onChange={(event) => setDescription(event.target.value)}
            />
          )}
        </Field>

        <Field
          label="Visibility"
          hint="Who can see the project and its conversations."
        >
          {({ id, describedBy }) => (
            <Select
              id={id}
              value={visibility}
              aria-describedby={describedBy}
              onChange={(event) =>
                setVisibility(event.target.value as ProjectVisibility)
              }
            >
              <option value="private">Private — only invited members</option>
              <option value="team">Team — everyone in your team</option>
              <option value="organization">
                Organisation — everyone at Northwind
              </option>
            </Select>
          )}
        </Field>
      </form>
    </Modal>
  );
}
