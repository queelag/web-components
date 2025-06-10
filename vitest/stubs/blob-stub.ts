import { Blob } from 'buffer'
import { vi } from 'vitest'

vi.stubGlobal('Blob', Blob)
