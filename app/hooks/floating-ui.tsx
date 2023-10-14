import { ElementProps, FloatingContext, ReferenceType } from "@floating-ui/react";
import { isMouseLikePointerType, isTypeableElement } from "@floating-ui/react/utils";
import { isHTMLElement } from "@floating-ui/utils/dom";
import { useMemo, useRef } from "react";

function isButtonTarget(event: React.KeyboardEvent<Element>) {
  return isHTMLElement(event.target) && event.target.tagName === "BUTTON";
}

function isSpaceIgnored(element: Element | null) {
  return isTypeableElement(element);
}

export interface UseClickProps {
  enabled?: boolean;
  event?: "click" | "mousedown";
  toggle?: boolean;
  ignoreMouse?: boolean;
  keyboardHandlers?: boolean;
}

/**
 * Opens or closes the floating element when clicking the reference element.
 * @see https://floating-ui.com/docs/useClick
 */
export function useAnyClick<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseClickProps = {}
): ElementProps {
  const {
    open,
    onOpenChange,
    dataRef,
    elements: { domReference }
  } = context;
  const {
    enabled = true,
    event: eventOption = "mousedown",
    toggle = true,
    ignoreMouse = false,
    keyboardHandlers = true
  } = props;

  const pointerTypeRef = useRef<"mouse" | "pen" | "touch">();
  const didKeyDownRef = useRef(false);

  return useMemo(() => {
    if (!enabled) return {};

    return {
      reference: {
        onPointerDown(event) {
          pointerTypeRef.current = event.pointerType;
        },
        onMouseDown(event) {
          if (
            isMouseLikePointerType(pointerTypeRef.current, true)
            && ignoreMouse
          ) {
            return;
          }

          if (eventOption === "click") {
            return;
          }

          if (
            open
            && toggle
            && (dataRef.current.openEvent
              ? dataRef.current.openEvent.type === "mousedown"
              : true)
          ) {
            onOpenChange(false, event.nativeEvent);
          } else {
            // Prevent stealing focus from the floating element
            event.preventDefault();
            onOpenChange(true, event.nativeEvent);
          }
        },
        onClick(event) {
          if (eventOption === "mousedown" && pointerTypeRef.current) {
            pointerTypeRef.current = undefined;
            return;
          }

          if (
            isMouseLikePointerType(pointerTypeRef.current, true)
            && ignoreMouse
          ) {
            return;
          }

          if (
            open
            && toggle
            && (dataRef.current.openEvent
              ? dataRef.current.openEvent.type === "click"
              : true)
          ) {
            onOpenChange(false, event.nativeEvent);
          } else {
            onOpenChange(true, event.nativeEvent);
          }
        },
        onKeyDown(event) {
          pointerTypeRef.current = undefined;

          if (
            event.defaultPrevented
            || !keyboardHandlers
            || isButtonTarget(event)
          ) {
            return;
          }

          if (event.key === " " && !isSpaceIgnored(domReference)) {
            // Prevent scrolling
            event.preventDefault();
            didKeyDownRef.current = true;
          }

          if (event.key === "Enter") {
            if (open && toggle) {
              onOpenChange(false, event.nativeEvent);
            } else {
              onOpenChange(true, event.nativeEvent);
            }
          }
        },
        onKeyUp(event) {
          if (
            event.defaultPrevented
            || !keyboardHandlers
            || isButtonTarget(event)
            || isSpaceIgnored(domReference)
          ) {
            return;
          }

          if (event.key === " " && didKeyDownRef.current) {
            didKeyDownRef.current = false;
            if (open && toggle) {
              onOpenChange(false, event.nativeEvent);
            } else {
              onOpenChange(true, event.nativeEvent);
            }
          }
        },
        onContextMenu(event) {
          event.preventDefault();
        }
      }
    };
  }, [
    enabled,
    dataRef,
    eventOption,
    ignoreMouse,
    keyboardHandlers,
    domReference,
    toggle,
    open,
    onOpenChange
  ]);
}