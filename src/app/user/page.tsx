"use client";

import { Container, Input, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, Flex, Button, Card, CardBody, Box, Spinner, Switch, FormControl, Code, FormLabel, Select, Textarea} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface FormulaAssistantComponentProps {
    type: string
}

export default function FormulaAssistant({ type }: FormulaAssistantComponentProps) {
    const [query, setQuery] = useState('');
    const [software, setSoftware] = useState('excel');
    const [result, setResult] = useState('');
    const [mode, setMode] = useState('explanation');
    const [loading, setLoading] = useState(false);

    const [previousResults, setPreviousResults] = useState<any[]>([]);

    const process = async () => {
        setLoading(true);
        try {
            let request = {
                query: query,
                software: software,
                mode: mode
            }
            
            const response = await fetch('/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setQuery("");

            const data = await response.json();
            setResult(data.result);

            setPreviousResults([
                ...previousResults,
                {
                    ...request,
                    response: data.result
                }
            ])
        } catch (error) {
            console.error('There was an error processing the request', error);
            setResult("⚠️ There was an error. ⚠️")
        }
        setLoading(false);
    };

// Rest of the component remains unchanged

    return (
        <Container>
            <Box m="4">
                <Heading>Excel/Sheets</Heading>
                <FormControl display="flex" alignItems="central">
                    <FormLabel htmlFor="mode" mb='0'>
                        {mode === 'explanation' ? "Disable" : "Enable"} explanation mode
                    </FormLabel>
                    <Switch size='lg' isChecked={mode == "explanation"} onChange={(e) => setMode(e.target.value ? "explanation" : "generate")}/>
                </FormControl>

                <Select value={software} onChange={(e) => setSoftware(e.target.value)}>
                    <option value="excel">MS Excel</option>
                    <option value="sheets">Google Sheets</option>
                </Select>

                <Textarea mt="4" placeholder="What are you trying to solve?" onChange={(e) => setQuery(e.target.value)}></Textarea>
                <Button onClick={() => process()} disabled={loading}>Process</Button>
                {loading && <Spinner/>}
            </Box>
            <Box m="4">
                <Markdown>{result}</Markdown>
            </Box>
            <Box m="4">
                {previousResults.length > 0 && <Text fontSize={'x-large'} fontWeight={'bold'}>History</Text>}
                {previousResults.map((item, index) => (
                    <Accordion allowToggle key={index}>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box as="span" flex="1" textAlign="left">
                                        <b>{item.mode.toUpperCase()} {item.query} in {item.software}</b>
                                    </Box>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                {item.response}
                            </AccordionPanel>
                        </AccordionItem>

                    </Accordion>
                ))}
            </Box>
        </Container>
    )
}