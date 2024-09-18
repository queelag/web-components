import { AracnaFile, encodeText, importNodeFetch, useNodeFetch, wf } from '@aracna/core'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/input-file-element'
import type { AracnaInputFileElement as InputFileElement } from '../../../src/elements/input/input-file-element'
import { dispatchInputFileEvent, render } from '../../../vitest/dom-utils'

describe('InputFileElement', () => {
  let input: InputFileElement, native: HTMLInputElement, file: File

  beforeAll(async () => {
    // @ts-ignore
    delete global.Blob
    // @ts-ignore
    delete global.File

    await useNodeFetch(await importNodeFetch())
  })

  beforeEach(() => {
    input = document.createElement('aracna-input-file')
    native = document.createElement('input')

    input.append(native)

    file = new File(['hello'], 'file', { lastModified: Date.now(), type: 'text/plain' })
  })

  afterEach(() => {
    input.remove()
  })

  it('has correct attributes', async () => {
    await render(input)

    expect(native.disabled).toBeFalsy()
    expect(native.multiple).toBeFalsy()
    expect(native.readOnly).toBeFalsy()
    expect(native.type).toBe('file')
  })

  it('deserializes', async () => {
    await render(input)

    dispatchInputFileEvent(native, [file])
    await wf(() => input.file)

    expect(input.file?.arrayBuffer).toStrictEqual(new ArrayBuffer(0))
    expect(input.file?.blob).toStrictEqual(file)
    expect(input.file?.file).toStrictEqual(file)
    expect(input.file?.lastModified).toBe(file.lastModified)
    expect(input.file?.lastModifiedDate).toStrictEqual(new Date(file.lastModified))
    expect(input.file?.text).toBe('')
    expect(input.file?.type).toBe(file.type)

    input.clear()
    expect(input.file).toBeUndefined()

    // expect(input.file?.arrayBuffer).toStrictEqual(new ArrayBuffer(0))
    // expect(input.file?.base64).toBe('')
    // expect(input.file?.blob).toStrictEqual(AracnaFile.EMPTY.blob)
    // expect(input.file?.file).toStrictEqual(AracnaFile.EMPTY.file)
    // expect(input.file?.lastModified).toBeDefined()
    // expect(input.file?.lastModifiedDate).toBeDefined()
    // expect(input.file?.text).toBe('')
    // expect(input.file?.type).toBe('application/octet-stream')
  })

  it('deserializes and resolves array buffer', async () => {
    await render(input, { 'deserialize-file-resolve-array-buffer': 'true' })

    dispatchInputFileEvent(native, [file])
    await wf(() => input.file)

    expect(input.file?.arrayBuffer).toEqual(encodeText('hello').buffer)
    expect(input.file?.blob).toStrictEqual(file)
    expect(input.file?.file).toStrictEqual(file)
    expect(input.file?.lastModified).toBe(file.lastModified)
    expect(input.file?.lastModifiedDate).toStrictEqual(new Date(file.lastModified))
    expect(input.file?.text).toBe('')
    expect(input.file?.type).toBe(file.type)
  })

  it('deserializes and resolves text', async () => {
    await render(input, { 'deserialize-file-resolve-text': 'true' })

    dispatchInputFileEvent(native, [file])
    await wf(() => input.file)

    expect(input.file?.arrayBuffer).toStrictEqual(new ArrayBuffer(0))
    expect(input.file?.blob).toStrictEqual(file)
    expect(input.file?.file).toStrictEqual(file)
    expect(input.file?.lastModified).toBe(file.lastModified)
    expect(input.file?.lastModifiedDate).toStrictEqual(new Date(file.lastModified))
    expect(input.file?.text).toBe('hello')
    expect(input.file?.type).toBe(file.type)
  })

  it('supports multiple files', async () => {
    await render(input, { multiple: 'true' })

    dispatchInputFileEvent(native, [file])
    await wf(() => input.files.length > 0)

    expect(input.files[0]).toBeInstanceOf(AracnaFile)

    dispatchInputFileEvent(native, [file, file])
    await wf(() => input.files.length > 1)

    expect(input.files[0]).toBeInstanceOf(AracnaFile)
    expect(input.files[1]).toBeInstanceOf(AracnaFile)

    input.removeFile(input.files[0])
    expect(input.files).toHaveLength(1)

    input.clear()
    expect(input.files).toStrictEqual([])
  })
})
