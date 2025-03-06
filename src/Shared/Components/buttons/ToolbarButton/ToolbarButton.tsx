import { IonButton } from "@ionic/react";
import React from "react";

interface ToolbarButtonProps {
  children: React.ReactNode;
  click: () => void;
  triggerId?: string;
  show?: boolean;
  color?: string;
  slot?: string;
  routerLink?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ children, triggerId, click, show = true, color = "light", slot = "end", routerLink}) => {
  const [buttonColor, setButtonColor] = React.useState<string>(color);

  return (
    <IonButton
      onClick={click}
      fill="clear"
      id={triggerId}
      hidden={!show}
      color={buttonColor}
      slot={slot}
      className="ion-no-margin"
      size="small"
      routerLink={routerLink}
      onTouchStart={() => setButtonColor("primary")}
      onTouchEnd={() => setButtonColor(color)}
      onMouseDown={() => setButtonColor("primary")}
      onMouseUp={() => setButtonColor(color)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement, { className: "toolbar-sort-icon toolbar-icon" }) : child
      )}
    </IonButton>
  );
}

export default ToolbarButton;
