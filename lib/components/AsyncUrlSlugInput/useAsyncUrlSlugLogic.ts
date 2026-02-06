import { useCallback, useEffect, useRef, useState } from 'react'
import { ObjectInputProps, SanityDocument, useFormValue } from 'sanity'
import {
  formatSlugString,
  formatUrlPrefix,
  resolveUrlPrefix,
  type SlugGenerationOptions,
  type UrlSlugValue,
} from '../../helpers/slugGeneration'

interface UseAsyncUrlSlugLogicProps extends ObjectInputProps {
  value: UrlSlugValue
  onSlugChange: (value: UrlSlugValue | undefined) => void
}

export function useAsyncUrlSlugLogic({ value, schemaType, onSlugChange }: UseAsyncUrlSlugLogicProps) {
  const document = useFormValue([]) as SanityDocument | undefined
  const options = schemaType.options as SlugGenerationOptions

  const [urlPrefix, setUrlPrefix] = useState<string | undefined>()
  const [isPrefixLoading, setIsPrefixLoading] = useState<boolean>(false)
  const [prefixError, setPrefixError] = useState<string | null>(null)
  const isUpdatingSlug = useRef(false)

  const finalPrefix = formatUrlPrefix(urlPrefix || '')

  const getUrlPrefix = useCallback(
    async (doc: SanityDocument | undefined) => {
      if (!doc || !doc._id) {
        setUrlPrefix(undefined)
        setIsPrefixLoading(false)
        return
      }

      setIsPrefixLoading(true)
      setPrefixError(null)

      try {
        const prefix = await resolveUrlPrefix(doc, options)
        setUrlPrefix(prefix)
        setIsPrefixLoading(false)
      } catch (error) {
        console.error(`[async-url-slug] Couldn't generate URL prefix: `, error)
        setPrefixError(error instanceof Error ? error.message : 'Unknown error')
        setUrlPrefix(undefined)
        setIsPrefixLoading(false)
      }
    },
    [options],
  )

  useEffect(() => {
    if (isUpdatingSlug.current) {
      return // Don't re-fetch prefix during our own slug updates
    }
    getUrlPrefix(document)
    // Re-fetch when document changes (adjust dependencies as needed for your use case)
  }, [document?.category, document?.language, getUrlPrefix])

  const updateSlugValue = useCallback(
    (currentValue: string) => {
      isUpdatingSlug.current = true

      const newValue: UrlSlugValue | undefined = currentValue
        ? {
            current: currentValue,
            fullUrl: finalPrefix ? `${finalPrefix}${currentValue}` : undefined,
          }
        : undefined

      onSlugChange(newValue)

      // Reset flag after a brief delay to allow document update to complete
      setTimeout(() => {
        isUpdatingSlug.current = false
      }, 200)
    },
    [finalPrefix, onSlugChange],
  )

  const formatSlug = useCallback(
    (input?: string) => {
      const finalSlug = formatSlugString(input || value?.current || '', options?.maxLength)
      updateSlugValue(finalSlug)
    },
    [value, options?.maxLength, updateSlugValue],
  )

  const generateSlug = useCallback(async () => {
    if (!document) return

    const sourceValue =
      typeof options?.source === 'string'
        ? (document[options.source] as string | undefined)
        : undefined

    formatSlug(sourceValue)
  }, [document, options?.source, formatSlug])

  return {
    prefix: finalPrefix,
    isPrefixLoading,
    prefixError,
    generateSlug,
    updateSlugValue,
    formatSlug,
  }
}
