import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFile, FiVideo } from "react-icons/fi";
import { MdClose } from "react-icons/md";

export default function CompactUpload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
  disabled = false,
  required = true,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      previewFile(file);
      setSelectedFile(file);
      setValue(name, file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
    noClick: true,
    disabled: disabled,
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      previewFile(file);
      setSelectedFile(file);
      setValue(name, file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
  };

  useEffect(() => {
    if (required) {
      register(name, { required: "This field is required" });
    } else {
      register(name);
    }
  }, [register, name, required]);

  useEffect(() => {
    if (viewData || editData) {
      setPreviewSource(viewData || editData);
    }
  }, [viewData, editData]);

  const handleRemoveFile = () => {
    setPreviewSource("");
    setSelectedFile(null);
    setValue(name, null);
    setIsUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (disabled && !previewSource) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-richblack-5" htmlFor={name}>
        {label} {required && !disabled && <sup className="text-pink-200">*</sup>}
      </label>

      <div
        className={`relative ${
          isDragActive ? "bg-richblack-600 border-yellow-50" : "bg-richblack-700"
        } flex min-h-[120px] cursor-pointer items-center justify-center rounded-lg border-2 border-dotted border-richblack-500 transition-all duration-300 hover:border-richblack-400 ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        {...getRootProps()}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-3">
            <div className="relative group">
              {!video ? (
                <div className="relative">
                  <img
                    src={previewSource}
                    alt="Preview"
                    className="h-20 w-full rounded object-cover"
                  />
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    >
                      <MdClose size={12} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <video 
                    controls 
                    className="h-20 w-full rounded object-cover"
                  >
                    <source src={previewSource} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    >
                      <MdClose size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="mt-2 p-2 bg-richblack-600 rounded">
                <div className="flex items-center gap-2">
                  {video ? (
                    <FiVideo className="text-blue-400 text-sm flex-shrink-0" />
                  ) : (
                    <FiFile className="text-green-400 text-sm flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-richblack-50 text-xs font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-richblack-300 text-xs">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-3 text-center">
            <input
              {...getInputProps()}
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={video ? "video/*" : "image/*"}
              disabled={disabled}
            />
            
            {!disabled && (
              <>
                <div 
                  className="grid aspect-square w-10 place-items-center rounded-full bg-richblack-600 hover:bg-richblack-500 transition-colors mb-2 cursor-pointer"
                  onClick={() => !disabled && inputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-50"></div>
                  ) : (
                    <FiUploadCloud className="text-lg text-yellow-50" />
                  )}
                </div>

                <p 
                  className="text-xs text-richblack-200 cursor-pointer max-w-[180px]"
                  onClick={() => !disabled && inputRef.current?.click()}
                >
                  Drop {!video ? "image" : "video"} or{" "}
                  <span className="font-semibold text-yellow-50">browse</span>
                </p>

                <p className="text-xs text-richblack-400 mt-1">
                  {video ? "MP4, max 100MB" : "JPG, PNG, max 10MB"}
                </p>
              </>
            )}
          </div>
        )}

        {isDragActive && (
          <div className="absolute inset-0 bg-yellow-400/20 border-2 border-yellow-400 border-dashed rounded-lg flex items-center justify-center">
            <div className="text-yellow-50 text-center">
              <FiUploadCloud className="text-xl mx-auto mb-1" />
              <p className="text-xs font-medium">Drop here!</p>
            </div>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="text-xs text-pink-200">
          {errors[name].message || `${label} is required`}
        </span>
      )}
    </div>
  );
}
