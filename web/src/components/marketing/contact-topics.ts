/** Contact form topics. Values are stored in contact_messages.topic. Safe to import on client and server. */
export const CONTACT_TOPICS = [
  { value: "order", label: "A question about my order" },
  { value: "preview", label: "Photos & previews" },
  { value: "art", label: "Changes to my portrait" },
  { value: "shipping", label: "Shipping & delivery" },
  { value: "guarantee", label: "Returns, remakes & refunds" },
  { value: "memorial", label: "A memorial portrait" },
  { value: "gifts", label: "Gift Reveal & gift cards" },
  { value: "privacy", label: "Privacy & photo deletion" },
  { value: "partnerships", label: "Partnerships & press" },
  { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export const CONTACT_TOPIC_VALUES = CONTACT_TOPICS.map((t) => t.value) as [ContactTopic, ...ContactTopic[]];
