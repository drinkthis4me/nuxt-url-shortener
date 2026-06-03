import { FetchError } from 'ofetch'

export function getErrorMessage(err: unknown): string | FetchError {
  if (err instanceof FetchError) {
    return err
  }

  if (err instanceof Error) {
    return err.message
  }

  return 'Something went wrong, please try again.'
}
