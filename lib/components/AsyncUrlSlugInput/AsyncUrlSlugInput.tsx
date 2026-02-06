/*
 * Custom URL slug input for urlSlug object type
 * Provides async URL prefix generation with loading states for object inputs
 */

import { Box, Button, Card, Code, Flex, Spinner, Text, TextInput, Tooltip } from '@sanity/ui'
import React, { useCallback } from 'react'
import { ObjectInputProps, set, unset } from 'sanity'
import styled from 'styled-components'
import { type UrlSlugValue } from '../../helpers/slugGeneration'
import { useAsyncUrlSlugLogic } from './useAsyncUrlSlugLogic'

const UrlPrefix = styled(Card)`
  flex: 0 1 min-content;

  pre {
    padding: 1em 0;
  }

  pre,
  code {
    overflow: hidden;
    white-space: nowrap;
    max-width: 30ch;
    text-overflow: ellipsis;
  }

  // When no generate button is available, make it bigger
  &[data-no-generate='true'] {
    pre,
    code {
      max-width: 35ch;
    }
  }
`

const LoadingContainer = styled(Flex)`
  align-items: center;
  gap: 8px;
  padding: 12px;
`

/**
 * Custom async URL slug component for urlSlug object type:
 * - Shows loading state during async prefix generation
 * - Updates both current and fullUrl fields
 * - Works with object input instead of slug input
 */
export const AsyncUrlSlugInput = (props: ObjectInputProps) => {
  const { value, schemaType, onChange } = props
  const urlSlugValue = value as UrlSlugValue | undefined

  const { prefix, isPrefixLoading, prefixError, generateSlug, updateSlugValue, formatSlug } =
    useAsyncUrlSlugLogic({
      ...props,
      value: urlSlugValue as UrlSlugValue,
      onSlugChange: (newValue: UrlSlugValue | undefined) => {
        onChange(newValue ? set(newValue) : unset())
      },
    })

  const onSlugChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      updateSlugValue(event.currentTarget.value)
    },
    [updateSlugValue],
  )

  const onSlugBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      formatSlug(event.currentTarget.value)
      props.elementProps.onBlur?.(event)
    },
    [formatSlug, props.elementProps],
  )

  const renderPrefix = () => {
    if (isPrefixLoading) {
      return (
        <UrlPrefix>
          <LoadingContainer>
            <Spinner muted size={1} />
            <Text muted size={1}>
              Loading URL...
            </Text>
          </LoadingContainer>
        </UrlPrefix>
      )
    }

    if (prefixError) {
      return (
        <Tooltip
          content={
            <Box padding={2}>
              <Text>Error loading prefix: {prefixError}</Text>
            </Box>
          }
        >
          <UrlPrefix>
            <Code size={1}>Error</Code>
          </UrlPrefix>
        </Tooltip>
      )
    }

    if (prefix) {
      return prefix.length > 30 ? (
        <Tooltip
          content={
            <Box padding={2}>
              <Text>{prefix}</Text>
            </Box>
          }
        >
          <UrlPrefix data-no-generate={!schemaType.options?.source}>
            <Code size={1}>{prefix}</Code>
          </UrlPrefix>
        </Tooltip>
      ) : (
        <UrlPrefix data-no-generate={!schemaType.options?.source}>
          <Code size={1}>{prefix}</Code>
        </UrlPrefix>
      )
    }

    return null
  }

  return (
    <Flex style={{ gap: '0.5em' }} align="center">
      {renderPrefix()}
      <Box flex={3}>
        <TextInput
          value={urlSlugValue?.current || ''}
          readOnly={props.readOnly}
          {...props.elementProps}
          onChange={onSlugChange}
          onBlur={onSlugBlur}
          placeholder="url-friendly-slug"
        />
      </Box>
      {schemaType.options?.source && (
        <Button
          mode="ghost"
          type="button"
          disabled={props.readOnly || isPrefixLoading}
          onClick={generateSlug}
          text={'Generate'}
        />
      )}
    </Flex>
  )
}
