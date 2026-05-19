import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";

export default function Banner({ backgroundColor, icon, text }) {
  return (
    <Item className={`outline ${backgroundColor}`}>
      <ItemMedia>{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle>{text}</ItemTitle>
      </ItemContent>
    </Item>
  );
}
