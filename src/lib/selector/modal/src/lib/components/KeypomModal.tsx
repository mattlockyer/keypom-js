import React, { useEffect, useState } from "react";
import { renderModalType } from "../handleModalType";

import type { ModalOptions, ModalType, Theme } from "../modal.types";

interface ModalProps {
  options: ModalOptions;
  modalType: ModalType;
  visible: boolean;
  hide: () => void;
}

const getThemeClass = (theme?: Theme) => {
  switch (theme) {
    case "dark":
      return "dark-theme";
    case "light":
      return "light-theme";
    default:
      return "";
  }
};

export const KeypomModal: React.FC<ModalProps> = ({
  options,
  modalType,
  visible,
  hide,
}) => {
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hide();
      }
    };
    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);
  }, [hide]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`nws-modal-wrapper ${getThemeClass(options.theme)} ${
        visible ? "open" : ""
      }`}
    >
      <div
        className="nws-modal-overlay"
        onClick={() => {
          hide();
        }}
      />
      {renderModalType(modalType, options, hide)}
    </div>
  );
};
