import { UserEmailSchema } from "@monkeytype/schemas/users";
import { createForm } from "@tanstack/solid-form";
import { createSignal } from "solid-js";

import Ape from "../../ape/index";
import { hideModal } from "../../states/modals";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../states/notifications";
import { AnimatedModal } from "../common/AnimatedModal";
import { Captcha } from "../popups/Captcha";
import { InputField } from "../ui/form/InputField";
import { SubmitButton } from "../ui/form/SubmitButton";
import { fromSchema } from "../ui/form/utils";

export default function ForgotPassword() {
  const [captchaActive, setCaptchaActive] = createSignal(false);
  const form = createForm(() => ({
    defaultValues: {
      email: "",
      captcha: "",
    },
    onSubmit: async ({ value }) => {
      const result = await Ape.users.forgotPasswordEmail({
        body: { email: value.email, captcha: value.captcha },
      });

      if (result.status !== 200) {
        showErrorNotification(
          "Failed to send password reset email: " + result.body.message,
        );
        return;
      }

      showSuccessNotification(result.body.message, { durationMs: 5000 });
      hideModal("ForgotPassword");
    },
  }));
  return (
    <AnimatedModal
      id="ForgotPassword"
      title="Forgot Password"
      modalClass="max-w-[400px]"
      afterShow={() => void setCaptchaActive(true)}
      afterHide={() => void setCaptchaActive(false)}
    >
      <form
        class="grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          validators={{
            onChange: fromSchema(UserEmailSchema),
          }}
        >
          {(field) => (
            <InputField
              field={field}
              type="email"
              placeholder="email"
              showIndicator={true}
            />
          )}
        </form.Field>

        <Captcha
          id="ForgotPassword"
          when={captchaActive()}
          onComplete={(token) => {
            form.setFieldValue("captcha", token);
          }}
        />

        <SubmitButton form={form}>send email</SubmitButton>
      </form>
    </AnimatedModal>
  );
}
