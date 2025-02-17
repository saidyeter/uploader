'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteFile, FileItem, getBucketFiles, getDownloadUrl, } from '../../actions/files';
export default function BucketFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const bucketName = params.bucket as string;
  useEffect(() => {
    loadFiles();
  }, [bucketName]);

  async function loadFiles() {
    try {
      const result = await getBucketFiles(bucketName);
      if (result.success) {
        setFiles(result?.files ?? []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
    }
    setLoading(false);
  }

  const handleDownload = async (bucketName: string, fileName: string) => {
    try {
      const result = await getDownloadUrl(bucketName, fileName);
      if (result.success) {
        window.open(result.url, '_blank');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading file');
    }
  };

  const handleDelete = async (bucketName: string, fileName: string) => {
    try {
      const result = await deleteFile(bucketName, fileName);
      if (result.success) {
        await loadFiles();
        toast.success('File deleted successfully');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting file');
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {bucketName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </p>
          </div>
        </div>

        {files.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No files in this bucket</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                      <p>Modified: {new Date(file.lastModified).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleDownload(bucketName, file.name)}
                      title="Download"
                      className="p-2 rounded-full text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(bucketName, file.name)}
                      title="Delete"
                      className="p-2 rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}