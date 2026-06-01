import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type BannerProps = {
  backgroundColor: string;
  icon: ReactNode;
  text: string;
  actionLabel?: string;
  onClick?: () => void;
};

export default function Banner({ backgroundColor, icon, text, actionLabel, onClick }: BannerProps) {
  return (
    <Item className={`outline ${backgroundColor}`}>
      <ItemMedia>{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle>{text}</ItemTitle>
      </ItemContent>
      <ItemActions>
        {actionLabel && (
          <Button variant="outline" size="sm" onClick={onClick}>
            {actionLabel}
          </Button>
        )}
      </ItemActions>
    </Item>
  );
}
