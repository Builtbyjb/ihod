import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { ReactNode } from "react";

type BannerProps = {
  backgroundColor: string;
  icon: ReactNode;
  text: string;
};

export default function Banner({ backgroundColor, icon, text }: BannerProps) {
  return (
    <Item className={`outline ${backgroundColor}`}>
      <ItemMedia>{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle>{text}</ItemTitle>
      </ItemContent>
    </Item>
  );
}
