"use client"

import { cn } from "../utilities"
import { useCallback, useState } from "react"
import { motion } from "framer-motion"
import { type FileRejection, useDropzone, type Accept } from "react-dropzone"
import { Icon } from "./icon"


const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 8, y: -8, rotate: -3, opacity: 0.9 },
}

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}


export function FileUpload ({
  onChange,
  modifiedDate,
  multiple,
  accept,
}: {
  onChange?: (accepted: File[], rejected: FileRejection[]) => void
  modifiedDate?: boolean
  multiple?: boolean
  accept?: Accept
}) {
  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    setFiles(oldFiles => [...oldFiles, ...accepted])
    if (onChange != null) {
      onChange(accepted, rejected)
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
  })

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        whileHover="animate"
        className={cn(
          "group/file block rounded-lg cursor-pointer w-full",
          "relative overflow-hidden outline outline-slate-300",
        )}
      >
        <input
          {...getInputProps()}
          id="file-upload-handle"
          type="file"
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="pt-6 flex flex-col items-center">
            <p className="relative font-sans font-semibold text-slate-700 dark:text-slate-300 text-2xl">
              File Upload
            </p>
            <p className={cn(
              "relative font-sans font-normal text-slate-400",
              "dark:text-slate-400 text-base"
            )}>
              Drop files or click to upload
            </p>
          </div>
          {files.length > 0 &&
            <div className={cn(
              "bg-white border-t max-h-52 flex flex-col gap-2 relative w-full mx-auto",
              "p-6 overflow-scroll",
            )}>
              { 
                files.map(file => (
                  <FileListing key={file.name} 
                    file={file} 
                    modifiedDate={modifiedDate} 
                  />
                ))
              }
            </div>
          }
          {!files.length && <UploadIcon isDragActive={isDragActive} />}
        </div>
      </motion.div>
    </div>
  )
}

function FileListing ({ file, modifiedDate }: { 
  file: File
  modifiedDate?: boolean 
}) {
  return (
    <motion.div
      className={cn(
        "justify-start p-2 w-full mx-auto rounded-md",
        "border border-slate-300",
        "min-h-max grow",
      )}
    >
      <div className="flex justify-between w-full items-center gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className={cn(
            "text-base text-slate-700 dark:text-slate-300",
            "truncate max-w-xs",
          )}
        > {file.name} </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-slate-600 dark:bg-slate-800 dark:text-white shadow-input"
        > {(file.size / (1024 * 1024)).toFixed(2)} MB </motion.p>
      </div>

      <div className={cn(
        "flex text-sm md:flex-row flex-col items-start",
        "md:items-center w-full justify-between",
        "text-slate-600 dark:text-slate-400",
      )}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="px-1 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 "
        >
          {file.type}
        </motion.p>

        {modifiedDate === true && <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
        >
          modified{" "}
          {new Date(file.lastModified).toLocaleDateString()}
        </motion.p>}
      </div>
    </motion.div>
  )
}

export function GridPattern() {
  const columns = 30;
  const rows = 8;

  return (
    <div className={cn(
      "grid bg-slate-100 dark:bg-slate-900 shrink-0 flex-wrap",
      "justify-center items-center gap-x-px gap-y-px scale-105",
      `grid-cols-[repeat(18,1fr)] gap-2`,
    )}>
      {
        Array(columns * rows)
          .fill(0)
          .map((_, i) => {
            return (
              <div key={i} className={cn(
                `w-full aspect-square rounded-[2px] border border-slate-200`,
              )}> </div>
            )})
      }
    </div>
  )
}

export function UploadIcon ({ isDragActive }: { isDragActive: boolean }) {
  return (<div className="relative w-32 pb-6">
    <motion.div
      layoutId="file-upload"
      variants={mainVariant}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={cn(
        "relative group-hover/file:shadow-2xl z-40 bg-white",
        "dark:bg-slate-900 flex items-center justify-center",
        "h-20 w-full max-w-[10rem] mx-auto rounded-md",
        "border border-slate-300 origin-right",
        // "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
      )}
    >
      {isDragActive ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-600 flex flex-col items-center"
        >
          Drop it
          <Icon icon="upload" className="h-12 w-12 text-slate-600 dark:text-slate-400" />
        </motion.p>
      ) : (
        <Icon icon="upload" className="h-8 w-8 text-slate-600 dark:text-slate-300" />
      )}
    </motion.div>
    <motion.div
      variants={secondaryVariant}
      className={cn(
        "absolute opacity-0 border border-dashed border-sky-400",
        "inset-0 z-30 bg-transparent flex items-center justify-center",
        "h-20 w-full max-w-[10rem] mx-auto rounded-md",
      )}
    ></motion.div>  
  </div>)
}