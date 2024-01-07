import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Flex, Heading, Button } from "@chakra-ui/react";
import Auth from "../auth/page";

export default function AuthGuard() {
  const pathname = usePathname();

  return (
    <Container>
      <Flex alignItems="center" w="full" py="16" justifyContent="space-between">
        <Auth/>
      </Flex>
    </Container>
  );
}