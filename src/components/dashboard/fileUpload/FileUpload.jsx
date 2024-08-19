"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import toast from "react-hot-toast"

export const FileUpload = ({ onChange, endpoint }) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].fileUrl)
      }}
      onUploadError={(error) => {
        toast.error(`${error?.message}`)
      }}
    />
  )
}