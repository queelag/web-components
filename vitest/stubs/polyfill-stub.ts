import { vi } from 'vitest'

vi.mock('@aracna/core', async (io: any) => ({ ...(await io()), importNodeFetch: () => import('node-fetch') }))
