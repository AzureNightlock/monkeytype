/*
When using AnimatedModal we recommend you:
  >>> create a signal to set the status of the captcha
  >>> set the "when" prop to the value of the signal
  >>> Add it to AnimatedModal and use void when using the setter

Example usage:
  const [captchaActive, setCaptchaActive] = createSignal(false);

  <Captcha id="..." when={captchaActive()} onComplete={...} />

  <AnimatedModal
    afterShow={() => void setCaptchaActive(true)}
    afterHide={() => void setCaptchaActive(false)}
  >
*/

import { createEffect } from "solid-js";

import * as CaptchaController from "../../controllers/captcha-controller";
import { useRef } from "../../hooks/useRef";
import { showErrorNotification } from "../../states/notifications";

export function notifyCaptchaAvailability(): boolean {
  const available = CaptchaController.isCaptchaAvailable();
  if (!available) {
    showErrorNotification(
      "Captcha is not available. This could happen due to a blocked or failed network request. Please refresh the page or contact support if this issue persists.",
    );
  }
  return available;
}

export function Captcha(props: {
  id: string;
  when: boolean;
  onComplete: (token: string) => void;
}) {
  const [captchaRef, captchaEl] = useRef<HTMLDivElement>();

  let rendered = false;

  createEffect(() => {
    const el = captchaEl();
    if (el === undefined) return;

    if (props.when) {
      CaptchaController.render(el, props.id, props.onComplete);
      rendered = true;
    } else if (rendered) {
      CaptchaController.reset(props.id);
    }
  });

  return <div ref={captchaRef}></div>;
}
