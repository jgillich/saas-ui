import * as React from 'react'

import { chakra, HTMLChakraProps, forwardRef } from '@chakra-ui/react'
import { cx, MaybeFunction, runIfFn, __DEV__ } from '@chakra-ui/utils'

import {
  useForm,
  FormProvider,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  SubmitErrorHandler,
  ResolverOptions,
  ResolverResult,
  ChangeHandler,
  WatchObserver,
} from 'react-hook-form'
import { objectFieldResolver, FieldResolver } from './field-resolver'
import { MaybeRenderProp } from '@chakra-ui/react-utils'

export type { UseFormReturn, FieldValues, SubmitHandler }

interface FormOptions<TFieldValues extends FieldValues = FieldValues> {
  /**
   * The form schema, currently supports Yup schema only.
   */
  schema?: any
  /**
   * Triggers when any of the field change.
   */
  onChange?: WatchObserver<TFieldValues>
  /**
   * The submit handler.
   */
  onSubmit: SubmitHandler<TFieldValues>
  /**
   * Triggers when there are validation errors.
   */
  onError?: SubmitErrorHandler<TFieldValues>
  /**
   * Ref on the HTMLFormElement.
   */
  formRef?: React.RefObject<HTMLFormElement>
  /**
   * The form children, can be a render prop or a ReactNode.
   */
  children?: MaybeRenderProp<UseFormReturn<TFieldValues>>
}

// @todo Figure out how to pass down FieldValues to all Field components, if at all possible.

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends UseFormProps<TFieldValues>,
    Omit<
      HTMLChakraProps<'form'>,
      'children' | 'onChange' | 'onSubmit' | 'onError'
    >,
    FormOptions<TFieldValues> {}

export const Form = forwardRef(
  <TFieldValues extends FieldValues = FieldValues>(
    props: FormProps<TFieldValues>,
    ref: React.ForwardedRef<UseFormReturn<TFieldValues>>
  ) => {
    const {
      mode = 'all',
      resolver,
      reValidateMode,
      shouldFocusError,
      shouldUnregister,
      shouldUseNativeValidation,
      criteriaMode,
      delayError,
      schema,
      defaultValues,
      onChange,
      onSubmit,
      onError,
      formRef,
      children,
      ...rest
    } = props

    const form = {
      mode,
      resolver,
      defaultValues,
      reValidateMode,
      shouldFocusError,
      shouldUnregister,
      shouldUseNativeValidation,
      criteriaMode,
      delayError,
    }

    if (schema && !resolver) {
      form.resolver = Form.getResolver?.(schema)
    }

    const methods = useForm<TFieldValues>(form)
    const { handleSubmit } = methods

    // This exposes the useForm api through the forwarded ref
    React.useImperativeHandle(ref, () => methods, [ref, methods])

    React.useEffect(() => {
      let subscription: any
      if (onChange) {
        subscription = methods.watch(onChange)
      }
      return () => subscription?.unsubscribe()
    }, [methods, onChange])

    return (
      <FormProvider {...methods}>
        <chakra.form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit, onError)}
          {...rest}
          className={cx('saas-form', props.className)}
        >
          {runIfFn(children, methods)}
        </chakra.form>
      </FormProvider>
    )
  }
) as (<TFieldValues extends FieldValues>(
  props: FormProps<TFieldValues> & {
    ref?: React.ForwardedRef<UseFormReturn<TFieldValues>>
  }
) => React.ReactElement) & {
  displayName?: string
  getResolver?: GetResolver
  getFieldResolver: GetFieldResolver
}

Form.getFieldResolver = objectFieldResolver

if (__DEV__) {
  Form.displayName = 'Form'
}

export type GetResolver = (
  schema: any
) => <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>
) => Promise<ResolverResult<TFieldValues>>

export type GetFieldResolver = (schema: any) => FieldResolver
