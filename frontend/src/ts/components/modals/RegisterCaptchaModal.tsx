import { createSignal, JSXElement } from "solid-js";

import { hideModal, showModal } from "../../states/modals";
import { promiseWithResolvers } from "../../utils/misc";
import { AnimatedModal } from "../common/AnimatedModal";
import { Captcha, notifyCaptchaAvailability } from "../popups/Captcha";

const {
  promise: captchaPromise,
  resolve: resolveCaptcha,
  reset: resetCaptchaPromise,
} = promiseWithResolvers<string | undefined>();

export async function showRegisterCaptchaModal(): Promise<string | undefined> {
  if (!notifyCaptchaAvailability()) return undefined;
  resetCaptchaPromise();
  showModal("RegisterCaptcha");
  return captchaPromise;
}

export function RegisterCaptchaModal(): JSXElement {
  const [captchaActive, setCaptchaActive] = createSignal(false);

  return (
    <AnimatedModal
      id="RegisterCaptcha"
      title="Verify Captcha"
      mode="dialog"
      modalClass="p-4 sm:p-4 w-max"
      afterShow={() => void setCaptchaActive(true)}
      afterHide={() => {
        setCaptchaActive(false);
        resolveCaptcha(undefined);
      }}
    >
      <Captcha
        id="register"
        when={captchaActive()}
        onComplete={(token) => {
          resolveCaptcha(token);
          hideModal("RegisterCaptcha");
        }}
      />
    </AnimatedModal>
  );
}
