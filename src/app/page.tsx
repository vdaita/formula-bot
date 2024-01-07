import Image from 'next/image'
import styles from './page.module.css'
import { Container, Button, Textarea, Input, Flex, Heading } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Container>
      <Flex alignItems="center" w="full" py="16" justifyContent="space-between">
        <Heading>Formula Assistant</Heading>
        
        <Link href="/user" passHref>
         <Button>Go to Dashboard ➡️</Button>
        </Link>
      </Flex>
    </Container>
  )
}
