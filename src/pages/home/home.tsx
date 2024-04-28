import React, { useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, message, Upload } from 'antd'
import './App.css'
import { downloadExcel, processExcel } from '../../utils/excelUtils'

const { Dragger } = Upload

const props: UploadProps = {
  name: 'file',
  multiple: false,
  accept: '.xlsx',
  onChange(info) {
    const { status } = info.file
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    }
  }
}

const App: React.FC = () => {
  const [fileData, setFileData] = useState<any>(null)

  const handleExcelUpload = (file: File) => {
    processExcel(file, setFileData)
  }

  const handleDownloadSampleExcel = () => {
    const sampleData = [
      ['First', 'Second'],
      [4, 2],
      [1, 2],
      [1, 2],
      [2, 2],
      [5, 6]
    ]
    downloadExcel(sampleData, 'sample.xlsx')
  }

  return (
    <>
      <div className="download-button-container">
        <Button type="primary" onClick={handleDownloadSampleExcel}>
          Download Sample Excel
        </Button>
      </div>
      <Dragger {...props} beforeUpload={handleExcelUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag a single excel file to this area to upload
        </p>
        <p className="ant-upload-hint">This site will add, divide, and multiply the first two columns of your excel</p>
        <p className="ant-upload-hint">The excel is only processed and the data is not saved anywhere</p>
      </Dragger>
      <div className="download-button-container">
        {fileData && (
          <Button type="primary" onClick={() => downloadExcel(fileData, 'modified.xlsx')}>
            Download Modified Excel
          </Button>
        )}
      </div>
    </>
  )
}

export default App
