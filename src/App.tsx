import React, { useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { message, Upload, Button } from 'antd'
import * as XLSX from 'xlsx'
import './App.css'

const { Dragger } = Upload

const props: UploadProps = {
  name: 'file',
  multiple: false,
  accept: '.xlsx',
  onChange(info) {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files)
  }
}

const App: React.FC = () => {
  const [fileData, setFileData] = useState<any>(null)

  const processExcel = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const originalData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      const modifiedData = originalData.map((row: any, index: number) => {
        if (index === 0) {
          row.push('sum results')
        } else {
          row.push(row[0] + row[1])
        }
        return row
      })
      const newWorkbook = XLSX.utils.book_new()
      const newWorksheet = XLSX.utils.aoa_to_sheet(modifiedData)
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName)
      const wbout = XLSX.write(newWorkbook, { type: 'array', bookType: 'xlsx' })
      const fileBuffer = new Blob([wbout], { type: 'application/octet-stream' })
      setFileData(fileBuffer)
    }
    reader.readAsArrayBuffer(file)
  }

  const downloadExcel = () => {
    const url = window.URL.createObjectURL(new Blob([fileData]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'modified.xlsx')
    document.body.appendChild(link)
    link.click()
  }

  return (
    <>
      <Dragger {...props} beforeUpload={processExcel}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>
          Click or drag file to this area to upload
        </p>
        <p className='ant-upload-hint'>Support for a single excel</p>
      </Dragger>
      <div className='download-button-container'>
        {fileData && (
          <Button type='primary' onClick={downloadExcel}>
            Download Modified Excel
          </Button>
        )}
      </div>
    </>
  )
}

export default App
