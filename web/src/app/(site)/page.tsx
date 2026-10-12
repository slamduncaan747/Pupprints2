import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function HomePage() {
  return (
    <Container className="py-24">
      <h1 className="font-display text-6xl">Pup Prints</h1>
      <p className="mt-4 text-ink-2">Home page under construction.</p>
      <ButtonLink href="/create" className="mt-8">Create yours</ButtonLink>
    </Container>
  );
}
