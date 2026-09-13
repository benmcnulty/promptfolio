import {
  BackpackIcon,
  ChatBubbleIcon,
  Pencil2Icon,
  StarIcon,
} from '@radix-ui/react-icons';

const icons = {
  featured: StarIcon,
  work: BackpackIcon,
  chat: ChatBubbleIcon,
  art: Pencil2Icon,
};

export function CatalogLabelIcon({ label }: { label: string }) {
  const Icon = icons[label as keyof typeof icons];
  return Icon ? <Icon aria-hidden="true" /> : null;
}
