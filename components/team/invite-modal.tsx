"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/services/team.service";
import type { UserRole } from "@/types";

const ASSIGNABLE_ROLES: UserRole[] = ["admin", "member", "viewer"];

export function InviteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<UserRole>("member");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const parsed = emails
    .split(/[\s,;]+/)
    .map((value) => value.trim())
    .filter(Boolean);

  const invalid = parsed.filter(
    (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (parsed.length === 0) {
      setError("Add at least one email address.");
      return;
    }
    if (invalid.length > 0) {
      setError(
        `${invalid.length} address${invalid.length === 1 ? " isn't" : "es aren't"} valid: ${invalid.join(", ")}`,
      );
      return;
    }
    setError(undefined);

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitting(false);

    toast({
      variant: "info",
      title: "No invitations were sent",
      description: `${parsed.length} address${
        parsed.length === 1 ? "" : "es"
      } validated as ${ROLE_LABELS[role]}. Sending needs a backend.`,
    });
    setEmails("");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite people"
      description="Invitations expire after 7 days. Seats are only consumed once someone accepts."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button form="invite-form" type="submit" loading={submitting}>
            Send {parsed.length > 0 ? `${parsed.length} ` : ""}invitation
            {parsed.length === 1 ? "" : "s"}
          </Button>
        </>
      }
    >
      <form id="invite-form" onSubmit={onSubmit} noValidate className="space-y-4">
        <Field
          label="Email addresses"
          error={error}
          hint="Separate multiple addresses with commas, spaces or new lines."
          required
        >
          {({ id, describedBy, invalid: isInvalid }) => (
            <Textarea
              id={id}
              value={emails}
              invalid={isInvalid}
              aria-describedby={describedBy}
              placeholder={"amara.osei@northwind.example\nwei.chen@northwind.example"}
              onChange={(event) => setEmails(event.target.value)}
            />
          )}
        </Field>

        <Field label="Role" hint={ROLE_DESCRIPTIONS[role]}>
          {({ id, describedBy }) => (
            <Select
              id={id}
              value={role}
              aria-describedby={describedBy}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              {ASSIGNABLE_ROLES.map((value) => (
                <option key={value} value={value}>
                  {ROLE_LABELS[value]}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </form>
    </Modal>
  );
}
