import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { InputFileElement, InputFileElementAttributes } from '../../../src'
import type { QueelagFile } from '../../../src/classes/queelag.file'
import '../../../src/elements/input.file.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-input-file': InputFileProps
    }
  }
}

interface InputFileProps extends InputFileElementAttributes, DetailedHTMLProps<HTMLAttributes<InputFileElement>, InputFileElement> {}

export function InputFile() {
  const { element, ref } = useQueelagElement('q-input-file')
  const [props] = useState<InputFileProps>({})

  return (
    <div className='flex flex-col gap-2'>
      <q-input-file {...props} ref={ref} multiple native>
        <div className='w-64 h-32 flex justify-center items-center rounded-sm border border-dashed border-gray-400'>
          <span>File Dropzone</span>
        </div>
      </q-input-file>
      {!element?.native && element?.isFilesNotEmpty && (
        <div className='flex gap-1 p-1 rounded-sm border border-gray-400'>
          {element?.files.map((file: QueelagFile) => (
            <div className='flex items-center gap-2 px-2 py-1 border border-gray-400' key={file.id}>
              <span className='text-xs'>{file.name}</span>
              <q-icon
                fill='none'
                onClick={() => element.removeFile(file)}
                size={12}
                src='https://raw.githubusercontent.com/feathericons/feather/master/icons/x.svg'
                stroke='black'
                stroke-width={2}
              />
            </div>
          ))}
          <q-button onClick={element.clear} native>
            Clear
          </q-button>
        </div>
      )}
    </div>
  )
}
